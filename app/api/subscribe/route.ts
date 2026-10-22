import { NextRequest, NextResponse } from "next/server";
import { getPattern } from "@/lib/patterns";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 8_192;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.normalize("NFKC").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  if (attempts.size > 5_000) for (const [ip, entry] of attempts) if (entry.resetAt < now) attempts.delete(ip);
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) { attempts.set(key, { count: 1, resetAt: now + 15 * 60_000 }); return false; }
  entry.count += 1;
  return entry.count > 5;
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "Invalid request." }, { status: 415 });
  const origin = request.headers.get("origin");
  const requestHost = request.headers.get("host");
  try {
    if (origin && (!requestHost || new URL(origin).host !== requestHost)) return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  } catch { return NextResponse.json({ error: "Invalid request." }, { status: 403 }); }
  const bodyText = await request.text();
  if (bodyText.length > MAX_BODY_BYTES) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  let body: Record<string, unknown>;
  try { body = JSON.parse(bodyText); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  if (clean(body.website, 100)) return NextResponse.json({ error: "Unable to process this request." }, { status: 400 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": "900" } });
  const name = clean(body.name, 80);
  const email = clean(body.email, 254).toLowerCase();
  const patternId = clean(body.pattern_id, 100);
  const pattern = getPattern(patternId);
  if (!name || name.length < 2 || !EMAIL.test(email) || body.consent !== true || !pattern) return NextResponse.json({ error: "Please check your name, email, consent, and pattern." }, { status: 400 });
  const sourceUrl = clean(body.source_url, 500);
  let safeSourceUrl = "";
  try { const url = new URL(sourceUrl); if (url.host === requestHost) safeSourceUrl = url.toString(); } catch { /* omit invalid source */ }
  const webhook = process.env.N8N_LEAD_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ error: "Pattern signup is temporarily unavailable." }, { status: 503 });
  try { const parsed = new URL(webhook); if (parsed.protocol !== "https:" && process.env.NODE_ENV === "production") throw new Error("Webhook must use HTTPS"); } catch { return NextResponse.json({ error: "Pattern signup is temporarily unavailable." }, { status: 503 }); }
  const payload = {
    name, email, pattern_id: pattern.slug, pattern_title: pattern.title, source_url: safeSourceUrl,
    utm_source: clean(body.utm_source, 100), utm_medium: clean(body.utm_medium, 100), utm_campaign: clean(body.utm_campaign, 100),
    submitted_at: new Date().toISOString(),
  };
  try {
    const response = await fetch(webhook, {
      method: "POST", headers: { "Content-Type": "application/json", ...(process.env.N8N_LEAD_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.N8N_LEAD_WEBHOOK_SECRET}` } : {}) },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(8_000), cache: "no-store",
    });
    if (!response.ok) throw new Error(`n8n returned ${response.status}`);
    const downloadUrl = pattern.patternDownloadUrl || `/patterns/${pattern.slug}#instructions`;
    if (!downloadUrl.startsWith("/") || downloadUrl.startsWith("//")) throw new Error("Invalid pattern URL");
    return NextResponse.json({ message: "Your free pattern is ready.", downloadUrl }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Lead forwarding failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "We could not send your pattern right now. Please try again shortly." }, { status: 502 });
  }
}
