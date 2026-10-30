import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * POST /api/views — record a unique visitor (public, no auth needed)
 * Body: { visitorId: string }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const visitorId =
      typeof body?.visitorId === "string" && UUID_RE.test(body.visitorId) ? body.visitorId : null;

    if (visitorId) {
      await prisma.visitor.upsert({
        where: { id: visitorId },
        update: { lastSeen: new Date() },
        create: { id: visitorId },
      });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to record visitor:", error);
    return NextResponse.json({ ok: true }, { status: 201 }); // fail silently
  }
}