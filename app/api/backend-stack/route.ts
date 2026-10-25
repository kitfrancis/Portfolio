import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireSession } from "@/lib/require-session";

export async function GET() {
  const stacks = await prisma.backendStack.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(stacks);
}

export async function POST(req: Request) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const created = await prisma.backendStack.create({
    data: { name: body.name },
  });
  return NextResponse.json(created);
}