import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("[API] DELETE request for ID:", params.id);
    await prisma.post.delete({
      where: { id: params.id },
    });
    console.log("[API] Successfully deleted ID:", params.id);
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("[API] Delete error for ID:", params.id, error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { text, pinned, likes } = await request.json();
    const data: any = {};
    if (text !== undefined) data.text = text.slice(0, 280);
    if (likes !== undefined) data.likes = likes;
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
