'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { isAuthenticated } from '../auth';

export async function addRelease(formData: FormData) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');

  const id = Date.now().toString();
  const title = formData.get('title') as string;
  const year = formData.get('year') as string;
  const type = formData.get('type') as string;
  const youtubeUrl = (formData.get('youtubeUrl') as string) || null;
  const spotifyUrl = (formData.get('spotifyUrl') as string) || null;
  const appleMusicUrl = (formData.get('appleMusicUrl') as string) || null;
  const amazonMusicUrl = (formData.get('amazonMusicUrl') as string) || null;
  const youtubeMusicUrl = (formData.get('youtubeMusicUrl') as string) || null;

  await sql`
    INSERT INTO releases
      (id, title, year, type, youtube_url, spotify_url, apple_music_url, amazon_music_url, youtube_music_url)
    VALUES
      (${id}, ${title}, ${year}, ${type}, ${youtubeUrl}, ${spotifyUrl}, ${appleMusicUrl}, ${amazonMusicUrl}, ${youtubeMusicUrl})
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
