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
    const local = new Date(Date.now() + TZ);
    const startOfToday = new Date(
      Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - TZ
    );

    const [total, today] = await Promise.all([
      prisma.visitor.count(),
      prisma.visitor.count({ where: { lastSeen: { gte: startOfToday } } }),
    ]);

    return NextResponse.json({ total, today });
  } catch (error) {
    console.error("Failed to fetch visitor count:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}