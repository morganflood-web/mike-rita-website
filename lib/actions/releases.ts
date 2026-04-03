'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import type { CustomLink } from '../db';
import { isAuthenticated } from '../auth';

function parseCustomLinksJson(raw: string | null): string {
  if (!raw || raw.trim() === '') return '[]';
  try {
    const p = JSON.parse(raw) as unknown;
    if (!Array.isArray(p)) return '[]';
    const cleaned: CustomLink[] = [];
    for (const item of p) {
      if (!item || typeof item !== 'object') continue;
      const o = item as Record<string, unknown>;
      const label = typeof o.label === 'string' ? o.label.trim() : '';
      const url = typeof o.url === 'string' ? o.url.trim() : '';
      if (label && url) cleaned.push({ label, url });
    }
    return JSON.stringify(cleaned);
  } catch {
    return '[]';
  }
}

export async function addRelease(formData: FormData) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');

  const id = Date.now().toString();
  const title = formData.get('title') as string;
  const year = formData.get('year') as string;
  const type = formData.get('type') as string;
  const sortOrder = parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  const sortOrderSafe = Number.isFinite(sortOrder) ? sortOrder : 0;
  const albumArt = ((formData.get('albumArt') as string) || '').trim() || null;
  const heroImage = ((formData.get('heroImage') as string) || '').trim() || null;
  const customLinksJson = parseCustomLinksJson(formData.get('customLinks') as string | null);
  const youtubeUrl = (formData.get('youtubeUrl') as string) || null;
  const spotifyUrl = (formData.get('spotifyUrl') as string) || null;
  const appleMusicUrl = (formData.get('appleMusicUrl') as string) || null;
  const amazonMusicUrl = (formData.get('amazonMusicUrl') as string) || null;
  const youtubeMusicUrl = (formData.get('youtubeMusicUrl') as string) || null;

  await sql`
    INSERT INTO releases
      (id, title, year, type, sort_order, album_art, hero_image, custom_links,
       youtube_url, spotify_url, apple_music_url, amazon_music_url, youtube_music_url)
    VALUES
      (${id}, ${title}, ${year}, ${type}, ${sortOrderSafe}, ${albumArt}, ${heroImage}, ${customLinksJson},
       ${youtubeUrl}, ${spotifyUrl}, ${appleMusicUrl}, ${amazonMusicUrl}, ${youtubeMusicUrl})
  `;

  revalidatePath('/');
  revalidatePath('/releases');
  revalidatePath('/admin/releases');
}

export async function updateRelease(formData: FormData) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const year = formData.get('year') as string;
  const type = formData.get('type') as string;
  const sortOrder = parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  const sortOrderSafe = Number.isFinite(sortOrder) ? sortOrder : 0;
  const albumArt = ((formData.get('albumArt') as string) || '').trim() || null;
  const heroImage = ((formData.get('heroImage') as string) || '').trim() || null;
  const customLinksJson = parseCustomLinksJson(formData.get('customLinks') as string | null);
  const youtubeUrl = (formData.get('youtubeUrl') as string) || null;
  const spotifyUrl = (formData.get('spotifyUrl') as string) || null;
  const appleMusicUrl = (formData.get('appleMusicUrl') as string) || null;
  const amazonMusicUrl = (formData.get('amazonMusicUrl') as string) || null;
  const youtubeMusicUrl = (formData.get('youtubeMusicUrl') as string) || null;

  await sql`
    UPDATE releases
    SET title = ${title},
        year = ${year},
        type = ${type},
        sort_order = ${sortOrderSafe},
        album_art = ${albumArt},
        hero_image = ${heroImage},
        custom_links = ${customLinksJson},
        youtube_url = ${youtubeUrl},
        spotify_url = ${spotifyUrl},
        apple_music_url = ${appleMusicUrl},
        amazon_music_url = ${amazonMusicUrl},
        youtube_music_url = ${youtubeMusicUrl}
    WHERE id = ${id}
  `;

  revalidatePath('/');
  revalidatePath('/releases');
  revalidatePath('/admin/releases');
}

export async function deleteRelease(formData: FormData) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');

  const id = formData.get('id') as string;
  await sql`DELETE FROM releases WHERE id = ${id}`;

  revalidatePath('/');
  revalidatePath('/releases');
  revalidatePath('/admin/releases');
}
