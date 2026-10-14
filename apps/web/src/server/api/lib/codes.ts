import { randomInt } from "node:crypto";

// No 0/O or 1/I/L, so codes survive being read aloud or typed from a screen.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function randomCode(length: number) {
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}

export const orderNumber = () => `CV-${randomCode(8)}`;
export const ticketCode = () => `TK${randomCode(8)}`;
export const paymentReference = () => `CVP${Date.now().toString(36).toUpperCase()}${randomCode(6)}`;
export const certificateCode = () => `CERT-${randomCode(10)}`;
