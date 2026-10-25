import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireSession } from "@/lib/require-session";

export async function GET() {
  try {
    const bio = await prisma.bio.findFirst();
    return NextResponse.json(bio);
  } catch (error) {
    console.error("GET /api/bio failed:", error);
    return NextResponse.json({ error: "Failed to load bio" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    // Only accept the fields this site actually uses
    const data = { name: body.name, bio: body.bio, imageUrl: body.imageUrl };
    const existing = await prisma.bio.findFirst();

    if (existing) {
      const updated = await prisma.bio.update({ where: { id: existing.id }, data });
      return NextResponse.json(updated);
    }

    const created = await prisma.bio.create({ data });
    return NextResponse.json(created);
  } catch (error) {
    console.error("POST /api/bio failed:", error);
    return NextResponse.json({ error: "Failed to save bio" }, { status: 500 });
  }
}