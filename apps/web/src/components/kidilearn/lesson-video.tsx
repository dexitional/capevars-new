import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { LessonContent } from '#/lib/kidilearn/library'

type Narration = {
  video: string
  captions: string
  voice: string
  scenes: Array<{ start: number; end: number; text: string }>
}

export function LessonVideo({
  title,
  video,
  scenes,
  source,
}: {
  title: string
  video: string
  scenes: Array<string>
  source?: LessonContent['sourceVideo']
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const narration = useQuery({
    queryKey: ['kidilearn', 'narration', video],
    enabled: typeof window !== 'undefined' && !source,
    queryFn: async ({ signal }): Promise<Narration | null> => {
      const controller = new AbortController()
      const abort = () => controller.abort()
      signal.addEventListener('abort', abort, { once: true })
      if (signal.aborted) abort()
      const timeout = setTimeout(abort, 8_000)
      try {
        const response = await fetch(
          video.replace(/\.mp4$/, '.narration.json'),
          {
            signal: controller.signal,
          },
        )
        if (response.status === 404) return null
        if (!response.ok) throw new Error('Narration could not load')
        return await response.json()
      } finally {
        clearTimeout(timeout)
        signal.removeEventListener('abort', abort)
      }
    },
    staleTime: 60_000,
    retry: 1,
  })
  const audio = narration.data
  return (
    <>
      <p className="mt-1 text-xs text-slate-500">
        {source
          ? source.audio === 'synthetic-english'
            ? 'Original lesson video · Computer-generated English narration. Use the controls to adjust volume or playback speed.'
            : source.audio === 'english-guide'
              ? 'Original lesson video · English guidance. Use the controls to adjust volume or playback speed.'
              : 'Original silent demonstration · Follow the illustrated steps and lesson notes.'
          : narration.isPending
            ? 'Loading the lesson video…'
            : audio
              ? 'AI-narrated lesson · English captions available. Use the video controls to change volume or playback speed.'
              : narration.isError
                ? 'Narration could not load. Showing the original silent video; follow the notes below.'
                : 'This lesson video is silent. Follow the illustrations and notes below.'}
      </p>
      {(source || !narration.isPending) && (
        <video
          key={audio?.video ?? video}
          ref={ref}
          controls
          playsInline
          preload="metadata"
          className="mt-4 aspect-video w-full rounded-2xl bg-slate-950"
          src={audio?.video ?? video}
          poster={source?.poster}
          onError={() => setFailed(true)}
          onLoadedMetadata={() => setFailed(false)}
          aria-label={`${title} demonstration`}
        >
          {audio && (
            <track
              kind="captions"
              src={audio.captions}
              srcLang="en"
              label="English"
            />
          )}
        </video>
      )}
      {source?.transcript && (
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-semibold">
            Read the English guidance
          </summary>
          <p className="mt-3 leading-relaxed">{source.transcript}</p>
        </details>
      )}
      {source?.audioDownload && (
        <a
          href={source.audioDownload}
          download
          className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-teal-800"
        >
          Download English narration (MP3)
        </a>
      )}
      {failed && (
        <p role="alert" className="mt-3 text-sm">
          The video could not load. You can still use the lesson notes and
          activities below.
        </p>
      )}
      {(audio?.scenes.length || scenes.length > 0) && (
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-bold">
            {audio ? 'Read along and jump to a scene' : 'Follow the scenes'}
          </summary>
          <ol className="mt-3 space-y-3">
            {(audio?.scenes.map((s) => s.text) ?? scenes).map((text, i) => (
              <li key={i}>
                <button
                  className="mr-2 rounded-lg border px-2 py-1 text-xs font-bold"
                  type="button"
                  onClick={() => {
                    if (!ref.current) return
                    const start = audio?.scenes[i]?.start
                    if (start !== undefined) ref.current.currentTime = start
                    else if (Number.isFinite(ref.current.duration))
                      ref.current.currentTime =
                        (i * ref.current.duration) / scenes.length
                  }}
                >
                  Scene {i + 1}
                </button>
                {text}
              </li>
            ))}
          </ol>
        </details>
      )}
    </>
  )
}
