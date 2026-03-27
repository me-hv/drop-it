import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const handle = cookies().get('mocked_handle')?.value || cookies().get('drops_handle')?.value;
    const user = handle ? await prisma.user.findUnique({ where: { handle } }) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const conversations = await prisma.conversation.findMany({
      where: {
        users: {
          some: { id: user.id }
        }
      },
      include: {
        users: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("GET conversations error:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const handle = cookies().get('mocked_handle')?.value || cookies().get('drops_handle')?.value;
    const currentUser = handle ? await prisma.user.findUnique({ where: { handle } }) : null;

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json({ error: "Target user ID is required" }, { status: 400 });
    }

    // @ts-ignore
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { users: { some: { id: currentUser.id } } },
          { users: { some: { id: targetUserId } } }
        ]
      },
      include: {
        users: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // @ts-ignore
    if (!conversation) {
      // @ts-ignore
      conversation = await prisma.conversation.create({
        data: {
          users: {
            connect: [
              { id: currentUser.id },
              { id: targetUserId }
            ]
          }
        },
        include: {
          users: true,
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("POST conversation error:", error);
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
