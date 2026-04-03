import { sql } from '@vercel/postgres';

export async function setupDb() {
  // Shows table
  await sql`
    CREATE TABLE IF NOT EXISTS shows (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      venue TEXT NOT NULL,
      city TEXT NOT NULL,
      ticket_url TEXT NOT NULL,
      sold_out BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Releases table
  await sql`
    CREATE TABLE IF NOT EXISTS releases (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      year TEXT NOT NULL,
      type TEXT NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      album_art TEXT,
      hero_image TEXT,
      custom_links TEXT NOT NULL DEFAULT '[]',
      youtube_url TEXT,
      spotify_url TEXT,
      apple_music_url TEXT,
      amazon_music_url TEXT,
      youtube_music_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await migrateReleasesColumns();

  // Bio table (single row, keyed by id='main')
  await sql`
    CREATE TABLE IF NOT EXISTS bio (
      id TEXT PRIMARY KEY DEFAULT 'main',
      text TEXT NOT NULL DEFAULT ''
    )
  `;

  // Awards table
  await sql`
    CREATE TABLE IF NOT EXISTS awards (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      sort_order INT NOT NULL DEFAULT 0
    )
  `;

  // Seed shows if empty
  const showsCount = await sql`SELECT COUNT(*) FROM shows`;
  if (parseInt(showsCount.rows[0].count) === 0) {
    await sql`
      INSERT INTO shows (id, date, venue, city, ticket_url, sold_out) VALUES
      ('1', 'Fri, Apr 03, 2026', 'The Boardroom Comedy Club', 'Toronto, ON', 'https://theboardroomcomedyclub.com/event/mike-ritas-420-comedy-show-1-night-only-twice-april-3rd-at-boardroom-on-932-bloor-st-west/', false),
      ('2', 'Sat, Apr 04, 2026', 'The Boardroom Comedy Club', 'Toronto, ON', 'https://theboardroomcomedyclub.com/event/mike-ritas-420-comedy-show-1-night-only-twice-saturday-april-4th-at-boardroom-on-932-bloor-st-west/', false),
      ('3', 'Fri, May 08, 2026', 'Yuk Yuk''s Niagara Falls', 'Niagara Falls, ON', 'https://www.yukyuks.com/niagarafalls/show/mike-rita-43040', false),
      ('4', 'Sat, May 09, 2026', 'Yuk Yuk''s Niagara Falls', 'Niagara Falls, ON', 'https://www.yukyuks.com/niagarafalls/show/mike-rita-43040', false),
      ('5', 'Fri, May 15, 2026', 'Portuguese Cultural Centre of Mississauga', 'Mississauga, ON', 'https://www.eventbrite.com/e/mississauga-on-mike-ritas-big-giant-portuguese-festa-tickets-1985828941822', false),
      ('6', 'Mon, Jun 15, 2026', 'Punch Line Houston', 'Houston, TX', 'https://www.ticketmaster.com/the-portuguese-kids-present-houston-we-houston-texas-06-15-2026/event/3A006477C5E0AA1A', false)
    `;
  }

  // Seed releases if empty
  const releasesCount = await sql`SELECT COUNT(*) FROM releases`;
  if (parseInt(releasesCount.rows[0].count) === 0) {
    await sql`
      INSERT INTO releases (
        id, title, year, type, sort_order, album_art, hero_image, custom_links,
        youtube_url, spotify_url, apple_music_url, amazon_music_url, youtube_music_url
      ) VALUES
      ('r1', 'Reets', '2024', 'Special', 1,
        'reets-album-art.jpg', 'reets-hero.jpg', '[]',
        'https://www.youtube.com/watch?v=pxpZ8DKlFSQ',
        NULL, NULL, NULL, NULL),
      ('r2', 'Live in Toronto', '2022', 'Special', 2,
        'live-in-toronto-album-art.jpg', 'live-in-toronto-hero.jpg', '[]',
        'https://www.youtube.com/watch?v=9pYHH3Z9HoE',
        NULL, NULL, NULL, NULL),
      ('r3', 'Child of the 90s', '2019', 'Album', 4,
        'child-of-the-90s-album-art.jpg', NULL, '[]',
        NULL,
        'https://open.spotify.com/album/5Zf9bSIJKyK1e5RKDMaWlY',
        'https://music.apple.com/ca/album/child-of-the-90s/1480568010',
        'https://music.amazon.com/albums/B07YG6VY5Q',
        'https://music.youtube.com/browse/MPREb_Qv7RE1zFpnP'),
      ('r4', 'Pot Comic', '2017', 'Album', 3,
        'pot-comic-album-art.jpg', NULL, '[]',
        NULL,
        'https://open.spotify.com/album/4tWJLMklEUSJLT0MiOpj8K',
        'https://music.apple.com/ca/album/pot-comic/1263105791',
        'https://music.amazon.com/albums/B073HMKH7D',
        'https://music.youtube.com/browse/MPREb_Xhk3JLIHYkL')
    `;
  }
}

/** Idempotent column additions + backfill for existing deployments */
export async function migrateReleasesColumns() {
  await sql`ALTER TABLE releases ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE releases ADD COLUMN IF NOT EXISTS album_art TEXT`;
  await sql`ALTER TABLE releases ADD COLUMN IF NOT EXISTS hero_image TEXT`;
  await sql`ALTER TABLE releases ADD COLUMN IF NOT EXISTS custom_links TEXT DEFAULT '[]'`;

  await sql`
    UPDATE releases SET sort_order = CASE id
      WHEN 'r1' THEN 1 WHEN 'r2' THEN 2 WHEN 'r4' THEN 3 WHEN 'r3' THEN 4
      ELSE 0 END
    WHERE sort_order = 0
  `;

  await sql`
    UPDATE releases SET album_art = CASE id
      WHEN 'r1' THEN 'reets-album-art.jpg'
      WHEN 'r2' THEN 'live-in-toronto-album-art.jpg'
      WHEN 'r3' THEN 'child-of-the-90s-album-art.jpg'
      WHEN 'r4' THEN 'pot-comic-album-art.jpg'
      ELSE NULL END
    WHERE album_art IS NULL
  `;

  await sql`
    UPDATE releases SET hero_image = CASE id
      WHEN 'r1' THEN 'reets-hero.jpg'
      WHEN 'r2' THEN 'live-in-toronto-hero.jpg'
      ELSE NULL END
    WHERE hero_image IS NULL
  `;

  await sql`
    UPDATE releases SET custom_links = '[]' WHERE custom_links IS NULL
  `;
}

// ─── Type exports ───────────────────────────────────────────────────────────

export interface Show {
  id: string;
  date: string;
  venue: string;
  city: string;
  ticketUrl: string;
  soldOut: boolean;
}

export interface CustomLink {
  label: string;
  url: string;
}

export interface Release {
  id: string;
  title: string;
  year: string;
  type: string;
  sortOrder: number;
  albumArt?: string | null;
  heroImage?: string | null;
  customLinks: CustomLink[];
  youtubeUrl?: string | null;
  spotifyUrl?: string | null;
  appleMusicUrl?: string | null;
  amazonMusicUrl?: string | null;
  youtubeMusicUrl?: string | null;
}

export interface Bio {
  text: string;
}

export interface Award {
  id: string;
  text: string;
  sortOrder: number;
}
