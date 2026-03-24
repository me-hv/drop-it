import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

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
