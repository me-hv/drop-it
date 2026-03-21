import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const handle = cookies().get("mocked_handle")?.value;
    if (!handle) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { author: true }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Since Posts use email/handle interchangeably here, check if handle matches email prefix or handle
    if (post.author.handle !== handle && post.author.email.split('@')[0] !== handle) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
    const handle = cookies().get("mocked_handle")?.value;
    if (!handle) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, pinned, likes } = await request.json();

    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
      include: { author: true }
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (likes === undefined && existingPost.author.handle !== handle && existingPost.author.email.split('@')[0] !== handle) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data: any = {};
    if (text !== undefined) data.text = text.slice(0, 280);
    if (likes !== undefined) data.likes = likes;
    if (pinned !== undefined) {
      if (pinned) {
        await prisma.post.updateMany({
           where: { pinned: true, authorId: existingPost.authorId },
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
