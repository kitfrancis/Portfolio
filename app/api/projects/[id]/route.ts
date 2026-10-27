import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireSession } from "@/lib/require-session";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, imageUrl, category, stack } = body;

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: title.trim(),
        description,
        imageUrl,
        category,
        // Only touch stack when it was actually sent
        ...(Array.isArray(stack) && {
          stack: stack.map((t: unknown) => String(t).trim()).filter(Boolean),
        }),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}