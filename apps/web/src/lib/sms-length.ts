// How long an SMS is and how many it takes, shared by the composer and the server
// so the cost on screen is the cost charged.
const GSM7 = "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
const GSM7_EXT = "^{}\\[~]|€";

// {name} until there's an audience to measure.
const DEFAULT_NAME_LENGTH = 10;

// Characters phones and word processors slip in that look plain but would switch
// the whole message to Unicode, which fits 70 characters per SMS instead of 160.
const PLAIN_EQUIVALENTS: Array<[RegExp, string]> = [
  [/\r\n?/g, "\n"],
  [/[‘’‚‛′´`]/g, "'"],
  [/[“”„‟″«»]/g, '"'],
  [/[‐-―−]/g, "-"],
  [/…/g, "..."],
  [/[  -   　]/g, " "],
  [/[­​‌⁠﻿]/g, ""],
  [/•/g, "-"],
  [/(?:GH)?₵/g, "GHS"],
];

export function plainSmsText(text: string) {
  return PLAIN_EQUIVALENTS.reduce((t, [pattern, plain]) => t.replace(pattern, plain), text);
}

export const firstName = (name: string | null | undefined) => name?.trim().split(/\s+/)[0] || "there";

// The longest name {name} will become, so a message is never charged for less than it takes.
export function longestFirstName(recipients: Array<{ name: string | null }>) {
  return recipients.length ? recipients.reduce((longest, r) => Math.max(longest, firstName(r.name).length), 0) : DEFAULT_NAME_LENGTH;
}

// GSM-7 fits 160 characters (153 per part when split). Anything else makes the
// message Unicode: 70 (67 per part), and an emoji takes two of those.
export function smsLength(raw: string, nameLength = DEFAULT_NAME_LENGTH) {
  const text = plainSmsText(raw).trim().replace(/\{name\}/gi, "n".repeat(nameLength));
  let gsm = 0;
  const specials = new Set<string>();
  for (const ch of text) {
    if (GSM7.includes(ch)) gsm += 1;
    else if (GSM7_EXT.includes(ch)) gsm += 2;
    else specials.add(ch);
  }
  const unicode = specials.size > 0;
  const length = unicode ? text.length : gsm;
  const [single, part] = unicode ? [70, 67] : [160, 153];
  const segments = length <= single ? 1 : Math.ceil(length / part);
  return { segments, unicode, length, limit: segments === 1 ? single : part * segments, specials: [...specials] };
}
