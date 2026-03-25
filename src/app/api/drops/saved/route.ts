import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const handle = cookies().get('mocked_handle')?.value || cookies().get('drops_handle')?.value;
    let user = handle ? await prisma.user.findUnique({ where: { handle } }) : null;
    
    if (!user) {
      user = await prisma.user.findFirst();
    }
    
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const savedDropsRelations = await (prisma as any).savedDrop.findMany({
      where: { userId: user.id },
      include: {
        drop: {
          include: {
            author: true,
            quoted: {
              include: {
                author: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const drops = savedDropsRelations.map(rel => rel.drop);

    return NextResponse.json(drops);
  } catch (err: any) {
    console.error("Fetch saved drops error:", err);
    return NextResponse.json({ error: "Failed to fetch saved drops" }, { status: 500 });
  }
}
