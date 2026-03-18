import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.post.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { text, pinned } = await request.json();
    const data: any = {};
    if (text !== undefined) data.text = text.slice(0, 280);
    if (pinned !== undefined) {
      // Unpin others (optional logic, but usually only one post is pinned)
      if (pinned) {
        await prisma.post.updateMany({
           where: { pinned: true },
           data: { pinned: false }
        });
      }
      data.pinned = pinned;
    }
    const post = await prisma.post.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}
