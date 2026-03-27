import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { handle, email, password } = await req.json();
    
    if (!handle || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists using raw SQL
    const existingUsers = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM User WHERE handle = ? OR email = ? LIMIT 1`,
      handle, email
    );

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user using raw SQL to bypass out-of-date Prisma client DMMF (locked files)
    const id = `u_${Math.random().toString(36).substring(2, 15)}`;
    await prisma.$executeRawUnsafe(
      `INSERT INTO User (id, handle, email, name, password, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
      id, handle, email, handle, hashedPassword, new Date().toISOString()
    );

    const user = { id, handle };

    const response = NextResponse.json({ success: true, user: { id: user.id, handle: user.handle } });
    
    // Set session cookie
    response.cookies.set('drops_handle', handle, { 
      path: '/', 
      maxAge: 30 * 24 * 60 * 60 
    });
    
    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: 'Registration failed', details: error.message }, { status: 500 });
  }
}
