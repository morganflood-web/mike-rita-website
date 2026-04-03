import { cookies } from 'next/headers';
import { createHash } from 'crypto';

const COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export function getSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? '';
  return hashPassword(`admin_session_${password}`);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session) return false;
  return session.value === getSessionToken();
}

export function buildSessionCookie(): {
  name: string;
  value: string;
  options: {
    httpOnly: boolean;
    sameSite: 'lax';
    path: string;
    maxAge: number;
    secure: boolean;
  };
} {
  return {
    name: COOKIE_NAME,
    value: getSessionToken(),
    options: {
      httpOnly: true,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === 'production',
    },
  };
}

export function clearSessionCookie(): {
  name: string;
  value: string;
  options: { maxAge: number; path: string };
} {
  return {
    name: COOKIE_NAME,
    value: '',
    options: { maxAge: 0, path: '/' },
  };
}
