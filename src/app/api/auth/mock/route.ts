import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { handle } = await req.json();
    
    if (!handle) return NextResponse.json({ error: 'Handle is required' }, { status: 400 });

    const email = `${handle}@mock.local`;

    let user = await prisma.user.findFirst({ where: { handle } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: handle,
          handle: handle,
        }
      });
    }

    const response = NextResponse.json({ success: true, user });
    
    // Set cookie that lasts 30 days
    response.cookies.set('mocked_handle', handle, { 
      path: '/', 
      maxAge: 30 * 24 * 60 * 60 
    });
    
    return response;
  } catch (error) {
    console.error("Auth error details:", error);
    const errorMessage = error instanceof Error ? error.message : "Auth failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
