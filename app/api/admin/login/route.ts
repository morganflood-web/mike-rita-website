import { NextRequest, NextResponse } from 'next/server';
import { buildSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body as { password?: string };

  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD env var is not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const { name, value, options } = buildSessionCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(name, value, options);
  return response;
}
