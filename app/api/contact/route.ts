import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBJECTS = new Set(["Pattern question", "Pattern correction", "Collaboration", "Just saying hello", "Something else"]);
const attempts = new Map<string, { count: number; resetAt: number }>();

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.normalize("NFKC").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "";
}

function cleanMessage(value: unknown): string {
  return typeof value === "string" ? value.normalize("NFKC").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ").trim() : "";
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "Invalid request." }, { status: 415 });
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  try {
    if (origin && (!host || new URL(origin).host !== host)) return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  } catch { return NextResponse.json({ error: "Invalid request." }, { status: 403 }); }

  const raw = await request.text();
  if (raw.length > 12_000) return NextResponse.json({ error: "Message is too long." }, { status: 413 });
  let body: Record<string, unknown>;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  if (clean(body.website, 100)) return NextResponse.json({ error: "Unable to send this message." }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  if (attempts.size > 5_000) for (const [key, entry] of attempts) if (entry.resetAt < now) attempts.delete(key);
  const entry = attempts.get(ip);
  if (entry && entry.resetAt > now) {
    entry.count += 1;
    if (entry.count > 5) return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429, headers: { "Retry-After": "900" } });
  } else attempts.set(ip, { count: 1, resetAt: now + 15 * 60_000 });

  const name = clean(body.name, 80);
  const email = clean(body.email, 254).toLowerCase();
  const subject = clean(body.subject, 100);
  const message = cleanMessage(body.message);
  if (name.length < 2 || !EMAIL.test(email) || !SUBJECTS.has(subject) || message.length < 10 || message.length > 5000) return NextResponse.json({ error: "Please check the required fields." }, { status: 400 });

  const webhook = process.env.N8N_CONTACT_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ error: "Email draft required." }, { status: 503 });
  try {
    const url = new URL(webhook);
    if (url.protocol !== "https:" && process.env.NODE_ENV === "production") throw new Error("HTTPS required");
  } catch { return NextResponse.json({ error: "Email draft required." }, { status: 503 }); }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(process.env.N8N_CONTACT_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.N8N_CONTACT_WEBHOOK_SECRET}` } : {}) },
      body: JSON.stringify({ name, email, subject, message, submitted_at: new Date().toISOString() }),
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Contact webhook returned ${response.status}`);
    return NextResponse.json({ message: "Message sent." }, { headers: { "Cache-Control": "no-store" } });
  } catch (cause) {
    console.error("Contact delivery failed", cause instanceof Error ? cause.message : "Unknown error");
    return NextResponse.json({ error: "Email draft required." }, { status: 503 });
  }
}
