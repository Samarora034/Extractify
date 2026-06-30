import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: 'User already exists' }, { status: 409 });

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { name, email, password: hashed } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registration failed: ' + error.message }, { status: 500 });
  }
}
