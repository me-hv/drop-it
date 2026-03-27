import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ users: [], drops: [] });
    }

    const cleanQuery = query.startsWith("@") ? query.substring(1) : query;

    const [users, drops] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { handle: { contains: cleanQuery } }
          ]
        },
        take: 10
      }),
      prisma.drop.findMany({
        where: {
          text: { contains: query }
        },
        include: {
          author: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 20
      })
    ]);

    return NextResponse.json({ users, drops });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
