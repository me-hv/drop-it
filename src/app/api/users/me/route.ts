import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const handle = cookieStore.get('mocked_handle')?.value;

    if (!handle) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user = await (prisma.user as any).findUnique({
      where: { handle },
      include: { 
        drops: { 
          where: { createdAt: { lte: new Date() } },
          take: 10, 
          orderBy: { createdAt: 'desc' } 
        },
        _count: {
          select: {
            followers: true,
            following: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  let requestData: any = {};
  try {
    const cookieStore = cookies();
    const sessionHandle = cookieStore.get('mocked_handle')?.value;
    if (!sessionHandle) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    requestData = await request.json();
    console.log("[API] PATCH /api/users/me - Request Data:", requestData);
    const { name, bio, location, website, handle, image, coverImage } = requestData;

    // Build the update object carefully
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;
    if (image !== undefined) updateData.image = image;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    
    // Only update handle if it's provided and not empty
    if (handle) {
      updateData.handle = handle.replace(/^@/, "").toLowerCase();
    }

    console.log("[API] Attempting Prisma update with:", updateData);

    const user = await prisma.user.update({
      where: { handle: sessionHandle },
      data: updateData
    });

    console.log("[API] Update successful for user:", user.id);
    return NextResponse.json(user);
  } catch (error: any) {
    console.error("[API] PATCH /api/users/me - Error:", error);
    
    // Detailed error reporting for the client
    let errorMessage = "Failed to update profile";
    if (error.code === 'P2002') {
      const target = error.meta?.target || "field";
      errorMessage = `The ${target} '${requestData?.handle || requestData?.name}' is already taken.`;
    } else if (error.message) {
      errorMessage = `Database Error: ${error.message}`;
    }

    return NextResponse.json({ 
      error: errorMessage,
      details: {
        code: error.code,
        meta: error.meta,
        message: error.message
      }
    }, { status: 500 });
  }
}
