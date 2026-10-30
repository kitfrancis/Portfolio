import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

const TZ = 8 * 60 * 60 * 1000; // Asia/Manila (UTC+8)
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const manilaDay = () => new Date(Date.now() + TZ).toISOString().slice(0, 10);

/**
 * POST /api/views — record that a visitor came today (public, no auth needed)
 * Body: { visitorId: string }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const visitorId =
      typeof body?.visitorId === "string" && UUID_RE.test(body.visitorId) ? body.visitorId : null;

    if (visitorId) {
      await prisma.visitorDay.createMany({
        data: [{ visitorId, day: manilaDay() }],
        skipDuplicates: true, // already counted today: do nothing
      });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to record visitor:", error);
    return NextResponse.json({ ok: true }, { status: 201 }); // fail silently
  }
}