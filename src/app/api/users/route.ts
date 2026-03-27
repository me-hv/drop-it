import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    
    const handle = cookies().get('mocked_handle')?.value || cookies().get('drops_handle')?.value;
    const currentUser = handle ? await prisma.user.findUnique({ where: { handle } }) : null;

    const users = await prisma.user.findMany({
      where: {
        AND: [
          currentUser ? { id: { not: currentUser.id } } : {},
          {
            OR: [
              { name: { contains: query } },
              { handle: { contains: query } }
            ]
          }
        ]
      },
      take: 20,
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
