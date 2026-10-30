import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const TZ = 8 * 60 * 60 * 1000; // Asia/Manila (UTC+8)

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date(Date.now() + TZ).toISOString().slice(0, 10);

    const [total, todayCount] = await Promise.all([
      prisma.visitorDay.count(),
      prisma.visitorDay.count({ where: { day: today } }),
    ]);

    return NextResponse.json({ total, today: todayCount });
  } catch (error) {
    console.error("Failed to fetch visitor count:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}