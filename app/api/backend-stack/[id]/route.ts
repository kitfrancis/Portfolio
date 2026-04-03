import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";

// 1. Change the type of params to Promise
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 2. Await the params to extract the id
    const { id } = await params;

    await prisma.backendStack.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete item" }, 
      { status: 500 }
    );
  }
}