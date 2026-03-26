import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rawDrops = await prisma.$queryRaw`
      SELECT 
        d.*,
        u.id as "author_id",
        u.name as "author_name",
        u.handle as "author_handle",
        qd.id as "q_id",
        qd.text as "q_text",
        qd.mediaUrl as "q_mediaUrl",
        qd.mediaType as "q_mediaType",
        qu.name as "q_author_name",
        qu.handle as "q_author_handle"
      FROM "Drop" d
      JOIN "User" u ON d."authorId" = u.id
      LEFT JOIN "Drop" qd ON d."quotedId" = qd.id
      LEFT JOIN "User" qu ON qd."authorId" = qu.id
      WHERE d.id = ${params.id}
      LIMIT 1
    `;

    const rawDrop = (rawDrops as any[])[0];

    if (!rawDrop) {
      return NextResponse.json({ error: "Drop not found" }, { status: 404 });
    }

    const drop = {
      ...rawDrop,
      isPinned: Boolean(rawDrop.isPinned),
      author: {
        id: rawDrop.author_id,
        name: rawDrop.author_name,
        handle: rawDrop.author_handle
      },
      quoted: rawDrop.q_id ? {
        id: rawDrop.q_id,
        text: rawDrop.q_text,
        mediaUrl: rawDrop.q_mediaUrl,
        mediaType: rawDrop.q_mediaType,
        author: {
          name: rawDrop.q_author_name,
          handle: rawDrop.q_author_handle
        }
      } : null
    };

    return NextResponse.json(drop);
  } catch (error) {
    console.error('Error fetching drop:', error);
    return NextResponse.json({ error: "Failed to fetch drop" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const handle = cookies().get("mocked_handle")?.value;
    if (!handle) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const drop = await prisma.drop.findUnique({
      where: { id: params.id },
      include: { author: true }
    });

    if (!drop) {
      return NextResponse.json({ error: "Drop not found" }, { status: 404 });
    }

    if (drop.author.handle !== handle) {
      return NextResponse.json({ error: "Forbidden - You can only delete your own drops." }, { status: 403 });
    }

    await prisma.drop.delete({
      where: { id: params.id }
    });

    // Decrement total drops for user stat accuracy
    await prisma.user.update({
      where: { id: drop.author.id },
      data: { totalDrops: { decrement: 1 } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting drop:', error);
    return NextResponse.json({ error: "Failed to delete drop" }, { status: 500 });
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

    const { text: newText, isPinned: newPinnedStatus } = await request.json();

    const drop = await prisma.drop.findUnique({
      where: { id: params.id },
      include: { author: true }
    });

    if (!drop) {
      return NextResponse.json({ error: "Drop not found" }, { status: 404 });
    }

    if (drop.author.handle !== handle) {
      return NextResponse.json({ error: "Forbidden - You can only edit your own drops." }, { status: 403 });
    }

    const updatedDrop = await prisma.drop.update({
      where: { id: params.id },
      data: { 
        text: newText !== undefined ? (newText || "") : drop.text,
        isPinned: newPinnedStatus !== undefined ? newPinnedStatus : drop.isPinned
      },
      include: { author: true }
    });

    return NextResponse.json(updatedDrop);
  } catch (error: any) {
    console.error('Error updating drop:', error);
    return NextResponse.json({ error: error.message || "Failed to update drop" }, { status: 500 });
  }
}
