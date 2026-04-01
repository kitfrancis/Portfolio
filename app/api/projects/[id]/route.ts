import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await prisma.project.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json(updated);
}