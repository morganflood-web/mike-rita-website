import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
  const { name, value, options } = clearSessionCookie();
  const response = NextResponse.redirect(
    new URL('/admin', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')
  );
  response.cookies.set(name, value, options);
  return response;
}
