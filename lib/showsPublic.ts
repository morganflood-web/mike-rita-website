import type { Show } from './db';
import { displayDateToIso } from './showDateFormat';

/** YYYY-MM-DD in local time, comparable with ISO date strings */
export function todayDateKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Short line for home (e.g. "Fri, Apr 03") from stored display date */
export function showDateShortNoYear(display: string): string {
  const iso = displayDateToIso(display);
  if (!iso) {
    return display.replace(/,?\s*\d{4}\s*$/, '').trim();
  }
  const [y, mo, d] = iso.split('-').map((x) => parseInt(x, 10));
  const dt = new Date(y, mo - 1, d);
  if (Number.isNaN(dt.getTime())) return display;
  return dt.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
  });
}

function sortKey(show: Show): string {
  return displayDateToIso(show.date) || show.date;
}

/** Shows on or after today, earliest first */
export function filterUpcomingShows(shows: Show[]): Show[] {
  const key = todayDateKey();
  return [...shows]
    .filter((s) => {
      const iso = displayDateToIso(s.date);
      return iso !== '' && iso >= key;
    })
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
}
