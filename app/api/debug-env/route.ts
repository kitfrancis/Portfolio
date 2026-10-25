import { NextResponse } from "next/server";

export async function GET() {
  const raw = process.env.DATABASE_URL ?? "";
  let info: Record<string, unknown> = { present: raw.length > 0 };

  try {
    const u = new URL(raw);
    info = {
      ...info,
      protocol: u.protocol,
      user: u.username,
      host: u.hostname,
      port: u.port,
      db: u.pathname,
    };
  } catch {
    info.parseError = "DATABASE_URL is not a valid URL";
  }

  info.startsWithQuote = raw.startsWith('"') || raw.startsWith("'");
  info.hasWhitespace = raw !== raw.trim();
  info.region = process.env.VERCEL_REGION;

  return NextResponse.json(info);
}