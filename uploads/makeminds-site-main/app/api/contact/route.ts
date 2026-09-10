/*
  Contact form serverless endpoint. POSTs from <ContactForm/>.
  Uses Resend to deliver mail. If RESEND_API_KEY is not configured, returns
  a 503 so the client can surface the mailto fallback instead of pretending
  to send. PLAN §Forms.

  Rate-limit: process-local in-memory cache for the cold-start lifetime of
  the function. Not durable across instances — fine for a tiny org site;
  the real abuse vector is bots, and even one per cold start hurts them.
*/

import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type Body = {
  name?: string;
  email?: string;
  reason?: string;
  message?: string;
};

const ALLOWED_REASONS = new Set([
  "sponsorship",
  "mentor",
  "partnership",
  "outreach",
  "judging",
  "join",
  "other",
]);

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Coarse rate limit. Keyed by best-effort IP.
const SUBMIT_WINDOW_MS = 60_000;
const SUBMIT_MAX = 3;
const recent = new Map<string, number[]>();

function ipFrom(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (recent.get(ip) ?? []).filter((t) => now - t < SUBMIT_WINDOW_MS);
  arr.push(now);
  recent.set(ip, arr);
  return arr.length > SUBMIT_MAX;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const reason = (body.reason ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || name.length > 120)
    return NextResponse.json({ error: "Name required (≤120 chars)." }, { status: 400 });
  if (!email || !EMAIL_RX.test(email))
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  if (!ALLOWED_REASONS.has(reason))
    return NextResponse.json({ error: "Unknown reason." }, { status: 400 });
  if (!message || message.length > 5000)
    return NextResponse.json({ error: "Message required (≤5000 chars)." }, { status: 400 });

  if (rateLimited(ipFrom(req)))
    return NextResponse.json({ error: "Too many submissions. Try again in a minute." }, { status: 429 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Don't pretend to send. Surface a 503 so the UI shows the mailto fallback.
    return NextResponse.json(
      { error: "Mail service not configured. Email us at info@makemindsrobotics.org." },
      { status: 503 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL ?? "info@makemindsrobotics.org";
  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      // For Resend's sandboxed sending domain, prefix any unverified sender
      // with `onboarding@resend.dev` so the message lands in dev too.
      from: "MakEMinds Site <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `[contact · ${reason}] ${name}`,
      text: [
        `Reason: ${reason}`,
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message,
      ].join("\n"),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/contact] resend send failed", err);
    return NextResponse.json(
      { error: "Mail provider rejected the message. Try the mailto link." },
      { status: 502 },
    );
  }
}
