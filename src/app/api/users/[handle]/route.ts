import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  try {
    const handle = params.handle.replace(/^@/, "").toLowerCase();

    const user = await prisma.user.findUnique({
      where: { handle },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            drops: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch drops separately to have more control (e.g., ordering)
    const drops = await prisma.drop.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    });

    return NextResponse.json({
      ...user,
      drops
    });
  } catch (error) {
    console.error("GET user by handle error:", error);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}
