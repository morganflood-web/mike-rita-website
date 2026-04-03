import type { Release } from './db';

const ORDER: Array<{ key: keyof Release; label: string }> = [
  { key: 'youtubeUrl', label: 'Watch on YouTube' },
  { key: 'spotifyUrl', label: 'Spotify' },
  { key: 'appleMusicUrl', label: 'Apple Music' },
  { key: 'amazonMusicUrl', label: 'Amazon Music' },
  { key: 'youtubeMusicUrl', label: 'YouTube Music' },
];

export function releasePlatformLinks(r: Release): { label: string; url: string }[] {
  const out: { label: string; url: string }[] = [];
  for (const { key, label } of ORDER) {
    const url = r[key];
    if (typeof url === 'string' && url.length > 0) {
      out.push({ label, url });
    }
  }
  return out;
}
