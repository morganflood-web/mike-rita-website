/**
 * Convert YYYY-MM-DD from <input type="date"> to display strings like "Wed, May 20, 2026"
 * (matches existing seeded show rows).
 */
export function isoDateToDisplay(iso: string): string {
  const trimmed = iso.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return trimmed;
  const y = parseInt(match[1], 10);
  const m = parseInt(match[2], 10) - 1;
  const d = parseInt(match[3], 10);
  const dt = new Date(y, m, d);
  if (Number.isNaN(dt.getTime())) return trimmed;
  return dt.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

/** Parse stored display date (e.g. "Fri, Apr 03, 2026") to YYYY-MM-DD for <input type="date"> */
export function displayDateToIso(display: string): string {
  const t = Date.parse(display.trim());
  if (Number.isNaN(t)) return '';
  const dt = new Date(t);
  const y = dt.getFullYear();
  const mo = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${mo}-${d}`;
}
