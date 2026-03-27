import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const handle = cookies().get('mocked_handle')?.value || cookies().get('drops_handle')?.value;
    const user = handle ? await prisma.user.findUnique({ where: { handle } }) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = params;

    // @ts-ignore
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        conversation: {
          users: {
            some: { id: user.id }
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: true
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const handle = cookies().get('mocked_handle')?.value || cookies().get('drops_handle')?.value;
    const user = handle ? await prisma.user.findUnique({ where: { handle } }) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = params;
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    // Verify user is part of the conversation
    // @ts-ignore
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { users: true }
    });

    // @ts-ignore
    if (!conversation || !conversation.users.some((u: any) => u.id === user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // @ts-ignore
    const message = await prisma.message.create({
      data: {
        text,
        senderId: user.id,
        conversationId
      },
      include: {
        sender: true
      }
    });

    // Update conversation's updatedAt for sorting
    // @ts-ignore
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("POST message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
