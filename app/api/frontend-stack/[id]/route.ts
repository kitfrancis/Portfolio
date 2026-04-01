import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.frontendStack.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}