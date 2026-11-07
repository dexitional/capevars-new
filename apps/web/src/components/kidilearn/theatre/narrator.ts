import { beatSeconds, speakable } from '#/lib/kidilearn/storyboard'
import type { Band } from '#/lib/kidilearn/storyboard'

export type VoiceMode = 'recorded' | 'device' | 'silent'
const SPEAK_DELAY_MS = 60
const RETRY_MS = 150
type Line = {
  text: string
  lang?: 'en' | 'fr'
  band: Band
  onProgress?: (fraction: number) => void
  onEnd: () => void
  onMode?: (mode: VoiceMode) => void
}

function pickVoice(lang: 'en' | 'fr') {
  if (typeof speechSynthesis === 'undefined') return null
  const voices = speechSynthesis.getVoices()
  const matching = voices.filter((v) => v.lang.toLowerCase().startsWith(lang))
  if (!matching.length) return null
  const score = (v: SpeechSynthesisVoice) =>
    (/natural|neural|premium|enhanced|google/i.test(v.name) ? 4 : 0) +
    (/^en-(gh|ng|gb)/i.test(v.lang) ? 2 : 0) +
    (v.localService ? 1 : 0)
  return [...matching].sort((a, b) => score(b) - score(a))[0]!
}

// Reads one line at a time and always reports the end of it, whichever voice
// the device has. With no voice at all the lesson still moves at reading speed.
export class Narrator {
  clips: Record<string, string> = {}
  muted = false
  rate = 1
  private run = 0
  private audio: HTMLAudioElement | null = null
  private utterance: SpeechSynthesisUtterance | null = null
  private timers: Array<ReturnType<typeof setTimeout>> = []

  stop() {
    this.run++
    this.timers.forEach(clearTimeout)
    this.timers = []
    if (this.audio) {
      this.audio.onended = this.audio.onerror = this.audio.ontimeupdate = null
      this.audio.onplaying = null
      this.audio.pause()
      this.audio = null
    }
    if (this.utterance) {
      this.dropUtterance()
      speechSynthesis.cancel()
    }
  }

  speak(line: Line) {
    this.stop()
    const run = this.run
    const text = speakable(line.text)
    const lang = line.lang ?? 'en'
    let ended = false
    const finish = () => {
      if (ended || run !== this.run) return
      ended = true
      line.onProgress?.(1)
      line.onEnd()
    }
    const clip = this.clips[`${lang}:${text}`]
    if (!text) return void this.schedule(finish, 200)
    if (this.muted) return this.silent(line, run, finish)
    if (clip) return this.playClip(clip, line, run, finish)
    this.device(text, lang, line, run, finish)
  }

  private schedule(fn: () => void, ms: number) {
    this.timers.push(setTimeout(fn, ms))
  }

  private silent(line: Line, run: number, finish: () => void) {
    line.onMode?.('silent')
    const total = (beatSeconds(line.text, line.band) * 1000) / this.rate
    const begun = Date.now()
    const tick = () => {
      if (run !== this.run) return
      const fraction = (Date.now() - begun) / total
      if (fraction >= 1) return finish()
      line.onProgress?.(fraction)
      this.schedule(tick, 120)
    }
    tick()
  }

  private playClip(url: string, line: Line, run: number, finish: () => void) {
    const fallback = () => {
      if (run !== this.run) return
      this.audio = null
      this.device(speakable(line.text), line.lang ?? 'en', line, run, finish)
    }
    const audio = new Audio(url)
    audio.playbackRate = this.rate
    this.audio = audio
    // A clip stuck on a slow network must not hold the lesson up.
    let started = false
    audio.onplaying = () => {
      started = true
    }
    this.schedule(() => {
      if (started || run !== this.run) return
      audio.onended =
        audio.onerror =
        audio.ontimeupdate =
        audio.onplaying =
          null
      audio.pause()
      fallback()
    }, 4000)
    this.schedule(
      finish,
      (beatSeconds(line.text, line.band) * 3000) / this.rate + 5000,
    )
    audio.ontimeupdate = () =>
      audio.duration && line.onProgress?.(audio.currentTime / audio.duration)
    audio.onended = () => this.schedule(finish, 450 / this.rate)
    audio.onerror = fallback
    audio.play().then(() => line.onMode?.('recorded'), fallback)
  }

  private device(
    text: string,
    lang: 'en' | 'fr',
    line: Line,
    run: number,
    finish: () => void,
  ) {
    // A language no voice can say stays silent rather than being misread.
    const voice = pickVoice(lang)
    if (!voice) return this.silent(line, run, finish)
    const limit = (beatSeconds(line.text, line.band) * 3000) / this.rate + 5000
    this.schedule(finish, limit)
    const attempt = (again: boolean) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = voice
      utterance.lang = voice.lang
      utterance.rate = this.rate * (line.band === 'kg' ? 0.9 : 1)
      this.utterance = utterance
      const giveUp = () => {
        this.dropUtterance()
        if (again) this.schedule(() => attempt(false), RETRY_MS)
        else this.silent(line, run, finish)
      }
      let started = false
      utterance.onstart = () => {
        started = true
        line.onMode?.('device')
      }
      utterance.onboundary = (event) =>
        line.onProgress?.(event.charIndex / Math.max(text.length, 1))
      utterance.onend = () => {
        // Finished speech needs no cancelling, and a needless cancel is what
        // upsets the next line.
        this.dropUtterance()
        this.schedule(finish, 350 / this.rate)
      }
      utterance.onerror = (event) => {
        if (run !== this.run) return
        const cutOff =
          event.error === 'interrupted' || event.error === 'canceled'
        if (cutOff) giveUp()
        else {
          this.dropUtterance()
          this.silent(line, run, finish)
        }
      }
      // Some phones accept a line and never read it, or never report the end.
      this.schedule(() => {
        if (started || run !== this.run || this.utterance !== utterance) return
        speechSynthesis.cancel()
        giveUp()
      }, 2500)
      speechSynthesis.speak(utterance)
    }
    // Chrome can lose a line sent straight after a cancel. Waiting a moment also
    // merges repeated requests for a line, since stop() clears this timer.
    this.schedule(() => attempt(true), SPEAK_DELAY_MS)
  }

  // Forget the current line without touching the speech engine.
  private dropUtterance() {
    if (!this.utterance) return
    this.utterance.onend = this.utterance.onerror = null
    this.utterance.onstart = this.utterance.onboundary = null
    this.utterance = null
  }

  // Call from a tap. Phones only let speech start from one, and the first line
  // now starts a moment after the tap.
  unlock() {
    if (typeof speechSynthesis === 'undefined') return
    const utterance = new SpeechSynthesisUtterance('')
    utterance.volume = 0
    speechSynthesis.speak(utterance)
  }
}
