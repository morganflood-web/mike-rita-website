import { sql } from '@vercel/postgres';
import type { Show, Release, Bio, Award, CustomLink } from './db';

function parseCustomLinks(raw: unknown): CustomLink[] {
  if (raw == null || raw === '') return [];
  const s = typeof raw === 'string' ? raw : String(raw);
  try {
    const p = JSON.parse(s) as unknown;
    if (!Array.isArray(p)) return [];
    return p
      .map((x) => {
        if (!x || typeof x !== 'object') return null;
        const o = x as Record<string, unknown>;
        const label = typeof o.label === 'string' ? o.label.trim() : '';
        const url = typeof o.url === 'string' ? o.url.trim() : '';
        if (!label || !url) return null;
        return { label, url };
      })
      .filter((x): x is CustomLink => x !== null);
  } catch {
    return [];
  }
}

function mapReleaseRow(row: Record<string, unknown>): Release {
  return {
    id: String(row.id),
    title: String(row.title),
    year: String(row.year),
    type: String(row.type),
    sortOrder: Number(row.sort_order ?? 0),
    albumArt: row.album_art != null ? String(row.album_art) : null,
    heroImage: row.hero_image != null ? String(row.hero_image) : null,
    customLinks: parseCustomLinks(row.custom_links),
    youtubeUrl: row.youtube_url != null ? String(row.youtube_url) : null,
    spotifyUrl: row.spotify_url != null ? String(row.spotify_url) : null,
    appleMusicUrl: row.apple_music_url != null ? String(row.apple_music_url) : null,
    amazonMusicUrl: row.amazon_music_url != null ? String(row.amazon_music_url) : null,
    youtubeMusicUrl: row.youtube_music_url != null ? String(row.youtube_music_url) : null,
  };
}

export async function getShows(): Promise<Show[]> {
  const result = await sql`
    SELECT id, date, venue, city, ticket_url, sold_out
    FROM shows
    ORDER BY created_at ASC
  `;
  return result.rows.map((row) => ({
    id: row.id,
    date: row.date,
    venue: row.venue,
    city: row.city,
    ticketUrl: row.ticket_url,
    soldOut: row.sold_out,
  }));
}

export async function getReleases(): Promise<Release[]> {
  const result = await sql`
    SELECT id, title, year, type, sort_order, album_art, hero_image, custom_links,
           youtube_url, spotify_url, apple_music_url, amazon_music_url, youtube_music_url
    FROM releases
    ORDER BY sort_order ASC, created_at ASC
  `;
  return result.rows.map((row) => mapReleaseRow(row as Record<string, unknown>));
}

/** First release with a hero image, ordered for home-page featured block */
export async function getFeaturedReleaseForHome(): Promise<Release | null> {
  const result = await sql`
    SELECT id, title, year, type, sort_order, album_art, hero_image, custom_links,
           youtube_url, spotify_url, apple_music_url, amazon_music_url, youtube_music_url
    FROM releases
    WHERE hero_image IS NOT NULL AND TRIM(hero_image) <> ''
    ORDER BY sort_order ASC, created_at ASC
    LIMIT 1
  `;
  const row = result.rows[0];
  if (!row) return null;
  return mapReleaseRow(row as Record<string, unknown>);
}

export async function getBio(): Promise<{ bio: Bio; awards: Award[] }> {
  const bioResult = await sql`SELECT text FROM bio WHERE id = 'main'`;
  const awardsResult = await sql`
    SELECT id, text, sort_order FROM awards ORDER BY sort_order ASC
  `;

  const bio: Bio = { text: bioResult.rows[0]?.text ?? '' };
  const awards: Award[] = awardsResult.rows.map((row) => ({
    id: row.id,
    text: row.text,
    sortOrder: row.sort_order,
  }));

  return { bio, awards };
}
