// Save as: app/api/experience/route.ts
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

export function parseExperience(body: any) {
  return {
    type: str(body?.type) || "Project",
    title: str(body?.title),
    org: str(body?.org),
    years: str(body?.years),
    current: Boolean(body?.current),
    summary: str(body?.summary),
    highlights: list(body?.highlights),
    stack: list(body?.stack),
  };
}

export async function GET() {
  const items = await prisma.experience.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = parseExperience(await req.json().catch(() => null));
  if (!data.title || !data.org || !data.years) {
    return NextResponse.json({ error: "Title, organization and years are required" }, { status: 400 });
  }
  const created = await prisma.experience.create({ data });
  return NextResponse.json(created, { status: 201 });
}