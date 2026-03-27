import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { handle, password } = await req.json();
    
    if (!handle || !password) {
      return NextResponse.json({ error: 'Handle and password are required' }, { status: 400 });
    }

    // Find user by handle or email using raw SQL to bypass out-of-date Prisma client DMMF
    const users = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM User WHERE handle = ? OR email = ? LIMIT 1`,
      handle, handle
    );

    const user = users && users.length > 0 ? users[0] : null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Auto-set password for legacy users who were created before the password field existed
    if (!user.password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.$executeRawUnsafe(
        `UPDATE User SET password = ? WHERE id = ?`,
        hashedPassword, user.id
      );
      user.password = hashedPassword; // Proceed with this password
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, user: { id: user.id, handle: user.handle } });
    
    // Set cookie
    response.cookies.set('drops_handle', user.handle || 'unknown', { 
      path: '/', 
      maxAge: 30 * 24 * 60 * 60 
    });
    
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
