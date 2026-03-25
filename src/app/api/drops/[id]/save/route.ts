import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const handle = cookies().get('mocked_handle')?.value || cookies().get('drops_handle')?.value;
    let user = handle ? await prisma.user.findUnique({ where: { handle } }) : null;
    
    if (!user) {
      user = await prisma.user.findFirst();
    }
    
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dropId = params.id;
    
    // Check if already saved
    const existing = await (prisma as any).savedDrop.findUnique({
      where: {
        userId_dropId: {
          userId: user.id,
          dropId: dropId
        }
      }
    });

    if (existing) {
      // Unsave
      await (prisma as any).savedDrop.delete({
        where: { id: existing.id }
      });
      
      // Decrement saves count
      await prisma.drop.update({
        where: { id: dropId },
        data: { saves: { decrement: 1 } }
      });
      
      return NextResponse.json({ saved: false });
    } else {
      // Save
      await (prisma as any).savedDrop.create({
        data: {
          userId: user.id,
          dropId: dropId
        }
      });
      
      // Increment saves count
      await prisma.drop.update({
        where: { id: dropId },
        data: { saves: { increment: 1 } }
      });
      
      return NextResponse.json({ saved: true });
    }
  } catch (err: any) {
    console.error("Toggle save error:", err);
    return NextResponse.json({ error: "Failed to toggle save" }, { status: 500 });
  }
}
