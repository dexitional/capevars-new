// Outbound SMS and email for LeadGen broadcasts.
//
// SMS:   SMSOnlineGH HTTP REST API v5 (https://dev.smsonlinegh.com/docs/v5/http/rest)
//        POST https://api.smsonlinegh.com/v5/message/sms/send, "Authorization: key <API key>".
//        Every sender name must also be registered in the SMSOnlineGH account.
// Email: Nodemailer over Gmail with an App Password (GMAIL_USER / GMAIL_APP_PASSWORD).
//        Messages are sent from GMAIL_USER with the member's sender name as the
//        display name and their email as Reply-To.
//
// With MESSAGING_SIMULATE=true (ignored in production) and no credentials,
// sends are logged and reported as successful so the whole flow can be tried
// locally without spending real credit.
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

const SMS_URL = "https://api.smsonlinegh.com/v5/message/sms/send";

const simulate = () => process.env.NODE_ENV !== "production" && process.env.MESSAGING_SIMULATE === "true";

export function messagingStatus() {
  const sms = Boolean(process.env.SMSONLINEGH_API_KEY);
  const email = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
  return {
    sms: sms || simulate(),
    email: email || simulate(),
    simulated: { sms: !sms && simulate(), email: !email && simulate() },
  };
}

// ---- Addresses ----------------------------------------------------------------------

// Ghana numbers to 233XXXXXXXXX; other numbers must already carry a country
// code (with or without "+"). Returns null for anything that isn't a phone number.
export function normalizePhone(raw: unknown): string | null {
  if (raw === null || raw === undefined) return null;
  let s = String(raw).trim();
  if (!s) return null;
  s = s.replace(/[\s\-().]/g, "");
  if (s.startsWith("+")) s = s.slice(1);
  else if (s.startsWith("00")) s = s.slice(2);
  if (!/^\d+$/.test(s)) return null;
  if (s.length === 10 && s.startsWith("0")) s = `233${s.slice(1)}`;
  else if (s.length === 9 && /^[235]/.test(s)) s = `233${s}`; // leading zero dropped by spreadsheets
  if (s.startsWith("233") && s.length !== 12) return null;
  return s.length >= 10 && s.length <= 15 ? s : null;
}

export function normalizeEmail(raw: unknown): string | null {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(s) && s.length <= 150 ? s : null;
}

// ---- SMS length -----------------------------------------------------------------------

const GSM7 =
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
const GSM7_EXT = "^{}\\[~]|€";

// How many SMS segments a message uses: GSM-7 is 160 chars (153 per part when
// split); anything else (emoji, many accents) is Unicode at 70 (67 per part).
export function smsSegments(text: string): { segments: number; unicode: boolean; length: number } {
  let gsmLen = 0;
  let unicode = false;
  for (const ch of text) {
    if (GSM7.includes(ch)) gsmLen += 1;
    else if (GSM7_EXT.includes(ch)) gsmLen += 2;
    else {
      unicode = true;
      break;
    }
  }
  if (unicode) {
    const len = [...text].length;
    return { segments: len <= 70 ? 1 : Math.ceil(len / 67), unicode, length: len };
  }
  return { segments: gsmLen <= 160 ? 1 : Math.ceil(gsmLen / 153), unicode, length: gsmLen };
}

// ---- SMS via SMSOnlineGH ---------------------------------------------------------------

export interface SmsDestination {
  number: string;
  name?: string | null;
}
export interface SendResult {
  address: string;
  ok: boolean;
  ref?: string | null;
  status?: string | null;
  error?: string | null;
}

// Personalised when the text uses {name}: SMSOnlineGH substitutes {$name}
// per destination from its `values` array.
export async function sendSms(sender: string, text: string, destinations: Array<SmsDestination>): Promise<Array<SendResult>> {
  const key = process.env.SMSONLINEGH_API_KEY;
  if (!key) {
    if (simulate()) {
      console.log(`[sms:simulated] ${sender} → ${destinations.length} recipients: ${text.slice(0, 80)}`);
      return destinations.map((d) => ({ address: d.number, ok: true, ref: "simulated", status: "SIMULATED" }));
    }
    throw new Error("SMS isn't configured. Set SMSONLINEGH_API_KEY.");
  }
  const personalised = /\{name\}/i.test(text);
  const body = {
    text: personalised ? text.replace(/\{name\}/gi, "{$name}") : text,
    type: smsSegments(text).unicode ? 1 : 0, // 0 = GSM default, 1 = Unicode
    sender,
    destinations: personalised ? destinations.map((d) => ({ number: d.number, values: [d.name?.split(/\s+/)[0] || "there"] })) : destinations.map((d) => d.number),
  };
  const res = await fetch(SMS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `key ${key}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  }).catch((err: unknown) => {
    throw new Error(`Couldn't reach SMSOnlineGH: ${err instanceof Error ? err.message : String(err)}`);
  });
  const json = (await res.json().catch(() => null)) as {
    handshake?: { id: number; label: string };
    data?: { batch?: string; destinations?: Array<{ id?: string; to?: string; status?: { id: number; label: string } }> };
  } | null;
  if (!res.ok || !json || json.handshake?.id !== 0) {
    const reason = json?.handshake?.label ?? `HTTP ${res.status}`;
    // A rejected request means nobody was messaged.
    return destinations.map((d) => ({ address: d.number, ok: false, error: `Gateway rejected the request (${reason})` }));
  }
  const byNumber = new Map((json.data?.destinations ?? []).map((d) => [String(d.to ?? ""), d]));
  return destinations.map((d) => {
    const r = byNumber.get(d.number);
    const label = r?.status?.label ?? "DS_PENDING_ENROUTE";
    const failed = /REJECT|ERR|INVALID|FAIL|BLACKLIST|BARRED/i.test(label);
    return { address: d.number, ok: !failed, ref: r?.id ?? json.data?.batch ?? null, status: label, error: failed ? label : null };
  });
}

export async function smsBalance(): Promise<{ balance: number; model: string } | null> {
  const key = process.env.SMSONLINEGH_API_KEY;
  if (!key) return null;
  const res = await fetch("https://api.smsonlinegh.com/v5/account/balance", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `key ${key}` },
    signal: AbortSignal.timeout(15_000),
  }).catch(() => null);
  const json = (await res?.json().catch(() => null)) as { handshake?: { id: number }; data?: { balance: number; model: string } } | null;
  return json?.handshake?.id === 0 && json.data ? json.data : null;
}

// ---- Email via Gmail ---------------------------------------------------------------------

let transporter: Transporter | undefined;

function gmail() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  transporter ??= nodemailer.createTransport({ service: "gmail", auth: { user, pass }, pool: true, maxConnections: 2, maxMessages: 100 });
  return { transporter, user };
}

export async function sendEmail(opts: {
  fromName: string;
  replyTo?: string | null;
  to: string;
  subject: string;
  html: string;
  text: string;
  unsubscribeUrl?: string;
}): Promise<SendResult> {
  const g = gmail();
  if (!g) {
    if (simulate()) {
      console.log(`[email:simulated] ${opts.fromName} → ${opts.to}: ${opts.subject}`);
      return { address: opts.to, ok: true, ref: "simulated", status: "SIMULATED" };
    }
    throw new Error("Email isn't configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.");
  }
  try {
    const info = await g.transporter.sendMail({
      from: { name: opts.fromName.replace(/["<>]/g, ""), address: g.user },
      replyTo: opts.replyTo ?? undefined,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      headers: opts.unsubscribeUrl ? { "List-Unsubscribe": `<${opts.unsubscribeUrl}>` } : undefined,
    });
    const rejected = (info.rejected ?? []).length > 0;
    return { address: opts.to, ok: !rejected, ref: info.messageId ?? null, status: rejected ? "REJECTED" : "ACCEPTED", error: rejected ? "Rejected by mail server" : null };
  } catch (err) {
    return { address: opts.to, ok: false, error: (err instanceof Error ? err.message : String(err)).slice(0, 300) };
  }
}
