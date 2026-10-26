import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireSession } from "@/lib/require-session";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { title, description, imageUrl, category, stack } = body;

    if (!title || !description || !imageUrl) {
      return NextResponse.json(
        { error: "Title, description, and imageUrl are required" },
        { status: 400 }
      );
    }

    const cleanStack = Array.isArray(stack)
      ? stack
          .filter((t): t is string => typeof t === "string")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl,
        category: category || "web",
        stack: cleanStack,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}