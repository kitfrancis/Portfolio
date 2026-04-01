import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const bio = await prisma.bio.findFirst();
  return NextResponse.json(bio);
}

export async function POST(req: Request) {
  const body = await req.json();
  const existing = await prisma.bio.findFirst();

  if (existing) {
    const updated = await prisma.bio.update({
      where: { id: existing.id },
      data: body,
    });
    return NextResponse.json(updated);
  }

  const created = await prisma.bio.create({ data: body });
  return NextResponse.json(created);
}