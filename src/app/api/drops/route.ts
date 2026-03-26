import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const handle = cookies().get('mocked_handle')?.value || cookies().get('drops_handle')?.value;

    let user = handle ? await prisma.user.findUnique({ where: { handle } }) : null;
    
    if (!user) {
      // In a real app we'd redirect to login, but for mock purposes we return an error if no user is found
      return NextResponse.json({ error: "Unauthorized. Please sync your handle first." }, { status: 401 });
    }

    const { text, mediaUrl, mediaType, duration, vibe, caption, pollOptions, pollEndsAt, scheduledDate, location, quotedId } = await request.json();

    if ((!text && !mediaUrl && !pollOptions) || !vibe) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const createData: any = {
        text,
        mediaUrl,
        mediaType,
        duration: duration || 0,
        vibe,
        caption: caption || "(No caption generated)",
        pollOptions,
        pollEndsAt: pollEndsAt ? new Date(pollEndsAt) : null,
        location,
        quotedId,
        authorId: user.id,
    };

    if (scheduledDate) {
        createData.createdAt = new Date(scheduledDate);
    }

    console.log("Creating drop with data:", JSON.stringify(createData, null, 2));

    const drop = await prisma.drop.create({
      data: createData,
      include: { author: true },
    });
    
    // Update user stats
    await prisma.user.update({
      where: { id: user.id },
      data: { totalDrops: { increment: 1 } }
    });

    console.log("Successfully created drop:", drop.id);
    return NextResponse.json(drop, { status: 201 });
  } catch (err: any) {
    console.error("POST drops error details:", {
       message: err.message,
       code: err.code,
       meta: err.meta,
       stack: err.stack,
    });
    return NextResponse.json({ error: "Failed to create drop" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const quotedId = searchParams.get("quotedId");
    
    // Get current user for saved state
    const handle = cookies().get('mocked_handle')?.value || cookies().get('drops_handle')?.value;
    let user = handle ? await prisma.user.findUnique({ where: { handle } }) : null;
    if (!user) user = await prisma.user.findFirst(); // Fallback for demo

    // We use queryRaw because the database table HAS the fields but the client might be stale
    let rawDrops;
    if (quotedId) {
      rawDrops = await prisma.$queryRaw`
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
          qu.handle as "q_author_handle",
          EXISTS(SELECT 1 FROM "SavedDrop" sd WHERE sd."dropId" = d.id AND sd."userId" = ${user?.id || ''}) as "isSaved"
        FROM "Drop" d
        JOIN "User" u ON d."authorId" = u.id
        LEFT JOIN "Drop" qd ON d."quotedId" = qd.id
        LEFT JOIN "User" qu ON qd."authorId" = qu.id
        WHERE d."quotedId" = ${quotedId}
        ORDER BY d."createdAt" ASC
      `;
    } else {
      rawDrops = await prisma.$queryRaw`
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
          qu.handle as "q_author_handle",
          EXISTS(SELECT 1 FROM "SavedDrop" sd WHERE sd."dropId" = d.id AND sd."userId" = ${user?.id || ''}) as "isSaved"
        FROM "Drop" d
        JOIN "User" u ON d."authorId" = u.id
        LEFT JOIN "Drop" qd ON d."quotedId" = qd.id
        LEFT JOIN "User" qu ON qd."authorId" = qu.id
        WHERE d."createdAt" <= datetime('now')
        ORDER BY d."isPinned" DESC, d."createdAt" DESC
      `;
    }

    // Map raw results back to the expected shape (nesting author)
    const drops = (rawDrops as any[]).map(d => ({
      ...d,
      isPinned: Boolean(d.isPinned), 
      isSaved: Boolean(d.isSaved),
      author: {
        id: d.author_id,
        name: d.author_name,
        handle: d.author_handle
      },
      quoted: d.q_id ? {
        id: d.q_id,
        text: d.q_text,
        mediaUrl: d.q_mediaUrl,
        mediaType: d.q_mediaType,
        author: {
          name: d.q_author_name,
          handle: d.q_author_handle
        }
      } : null
    }));

    return NextResponse.json(drops);
  } catch (err: any) {
    console.error("GET drops error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch drops" }, { status: 500 });
  }
}
