import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const stacks = await prisma.frontendStack.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(stacks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await prisma.frontendStack.create({
    data: { name: body.name }
  });
  return NextResponse.json(created);
}