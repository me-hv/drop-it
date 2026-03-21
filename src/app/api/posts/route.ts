import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true }
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const { text, authorEmail, authorName, mediaUrl, mediaType, metadata } = await request.json();

    if (!text?.trim() && !mediaUrl?.trim() && !metadata) {
      return NextResponse.json({ error: "Post is empty" }, { status: 400 });
    }

    let author = await prisma.user.findUnique({ where: { email: authorEmail } });
    if (!author) {
      author = await prisma.user.create({
        data: { email: authorEmail, name: authorName || "Anonymous" }
      });
    }

    const post = await prisma.post.create({
      data: {
        text: text?.slice(0, 280) || "",
        mediaUrl: mediaUrl || null,
        mediaType: mediaType || null,
        metadata: metadata || null,
        authorId: author.id,
      },
      include: { author: true },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post", details: error.message },
      { status: 500 }
    );
  }
}
