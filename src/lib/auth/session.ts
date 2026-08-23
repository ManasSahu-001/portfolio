/**
 * Session utilities implemented on Web Crypto so they work in both
 * the Node.js runtime (API routes) and the Edge runtime (middleware).
 */

const COOKIE_NAME = "ms_session";
const SESSION_TTL_S = 60 * 60 * 24 * 7;

export interface SessionPayload {
  email: string;
  exp: number;
}

const encoder = new TextEncoder();

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function secret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    `ms-portfolio::${process.env.ADMIN_PASSWORD ?? "dev"}`
  );
}

async function sign(payload: string): Promise<string> {
  const sig = await crypto.subtle.sign(
    "HMAC",
    await hmacKey(),
    encoder.encode(payload)
  );
  return b64urlEncode(new Uint8Array(sig));
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export function sessionCookieName(): string {
  return COOKIE_NAME;
}

export function sessionMaxAge(): number {
  return SESSION_TTL_S;
}

export async function createSessionToken(email: string): Promise<string> {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_S,
  };
  const encoded = b64urlEncode(encoder.encode(JSON.stringify(payload)));
  return `${encoded}.${await sign(encoded)}`;
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  const expected = await sign(encoded);
  try {
    if (!timingSafeEqual(b64urlDecode(sig), b64urlDecode(expected))) return null;
    const payload = JSON.parse(
      new TextDecoder().decode(b64urlDecode(encoded))
    ) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(text));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function checkCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const expectedEmail = process.env.ADMIN_EMAIL ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedEmail || !expectedPassword) return false;
  const emailOk = await sha256Hex(email.trim().toLowerCase()) === (await sha256Hex(expectedEmail.trim().toLowerCase()));
  const passwordOk = await sha256Hex(password) === (await sha256Hex(expectedPassword));
  return emailOk && passwordOk;
}
