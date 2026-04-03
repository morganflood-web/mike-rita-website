import { NextResponse } from 'next/server';
import { setupDb } from '@/lib/db';

/**
 * GET /api/setup
 *
 * Creates all required tables (shows, releases, bio, awards) and seeds
 * them with Mike's initial data if they are empty. `setupDb` also runs
 * release migrations (sort_order, album_art, hero_image, custom_links).
 *
 * Run this ONCE after connecting a Vercel Postgres database to the project.
 * It is idempotent — safe to run multiple times.
 */
export async function GET() {
  try {
    await setupDb();
    return NextResponse.json({
      ok: true,
      message: 'Database tables created and seeded successfully.',
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
