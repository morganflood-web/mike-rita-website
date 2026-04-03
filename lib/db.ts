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
      youtube_url TEXT,
      spotify_url TEXT,
      apple_music_url TEXT,
      amazon_music_url TEXT,
      youtube_music_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

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
      INSERT INTO releases (id, title, year, type, youtube_url, spotify_url, apple_music_url, amazon_music_url, youtube_music_url) VALUES
      ('r1', 'Reets', '2024', 'Special',
        'https://www.youtube.com/watch?v=pxpZ8DKlFSQ',
        NULL, NULL, NULL, NULL),
      ('r2', 'Live in Toronto', '2022', 'Special',
        'https://www.youtube.com/watch?v=9pYHH3Z9HoE',
        NULL, NULL, NULL, NULL),
      ('r3', 'Child of the 90s', '2019', 'Album',
        NULL,
        'https://open.spotify.com/album/5Zf9bSIJKyK1e5RKDMaWlY',
        'https://music.apple.com/ca/album/child-of-the-90s/1480568010',
        'https://music.amazon.com/albums/B07YG6VY5Q',
        'https://music.youtube.com/browse/MPREb_Qv7RE1zFpnP'),
      ('r4', 'Pot Comic', '2017', 'Album',
        NULL,
        'https://open.spotify.com/album/4tWJLMklEUSJLT0MiOpj8K',
        'https://music.apple.com/ca/album/pot-comic/1263105791',
        'https://music.amazon.com/albums/B073HMKH7D',
        'https://music.youtube.com/browse/MPREb_Xhk3JLIHYkL')
    `;
  }

  // Seed bio if empty
  const bioCount = await sql`SELECT COUNT(*) FROM bio`;
  if (parseInt(bioCount.rows[0].count) === 0) {
    await sql`
      INSERT INTO bio (id, text) VALUES (
        'main',
        'Mike Rita is an award-winning comedian from Toronto, known for his relatable storytelling and sharp humour. Drawing inspiration from his Portuguese heritage, Mike''s comedy explores themes of family dynamics, cultural identity, and everyday life experiences solidifying his status as a ''must-see'' performer.\n\nMike has made numerous appearances at the prestigious Just For Laughs festival and notably became the first comic to host a 420 show at the festival. In 2024, he was honoured by the president of Portugal as one of the 70 most significant Portuguese Canadians of the past 70 years, highlighting his impact and influence.\n\nHis albums, ''Pot Comic'' and ''Child of the 90s,'' have earned him the title "Voice of a Generation" for their humorous and timeless perspectives on life. Additionally, his comedy specials ''Live in Toronto'' and ''Reets'' are celebrated by many as one of the best to have come out of Canada in recent years, showcasing his unique ability to blend humour with heartfelt storytelling.'
      )
    `;
  }

  // Seed awards if empty
  const awardsCount = await sql`SELECT COUNT(*) FROM awards`;
  if (parseInt(awardsCount.rows[0].count) === 0) {
    await sql`
      INSERT INTO awards (id, text, sort_order) VALUES
      ('a1', '2024 — Honoured by the President of Portugal — one of the 70 most significant Portuguese Canadians of the past 70 years', 0),
      ('a2', '2022 — Canadian Screen Award Nominee — Best Performance, Sketch Comedy (Individual or Ensemble) — Roast Battle Canada', 1),
      ('a3', '2014 & 2015 — Now Magazine Runner-Up — Best Male Stand-Up', 2),
      ('a4', '2010 — Tim Sims Encouragement Award Winner — Second City Toronto', 3)
    `;
  }
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

export interface Release {
  id: string;
  title: string;
  year: string;
  type: string;
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
