// Save as: app/api/experience/[id]/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/db";
// Match this import to the server-side auth helper your other API routes use.
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function isAuthed() {
  const session = await auth.api.getSession({ headers: await headers() });
  return !!session;
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const list = (v: unknown) =>
  Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean) : [];

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const data = {
    type: str(body?.type) || "Project",
    title: str(body?.title),
    org: str(body?.org),
    years: str(body?.years),
    current: Boolean(body?.current),
    summary: str(body?.summary),
    highlights: list(body?.highlights),
    stack: list(body?.stack),
  };
  if (!data.title || !data.org || !data.years) {
    return NextResponse.json({ error: "Title, organization and years are required" }, { status: 400 });
  }
  try {
    const updated = await prisma.experience.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}