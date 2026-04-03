'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { isoDateToDisplay } from '../showDateFormat';
import { isAuthenticated } from '../auth';

function guard() {
  // Auth is enforced at the layout level but we double-check in actions
}

export async function addShow(formData: FormData) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');

  const id = Date.now().toString();
  const rawDate = (formData.get('date') as string) ?? '';
  const date = isoDateToDisplay(rawDate);
  const venue = formData.get('venue') as string;
  const city = formData.get('city') as string;
  const ticketUrl = formData.get('ticketUrl') as string;
  const soldOut = formData.get('soldOut') === 'on';

  await sql`
    INSERT INTO shows (id, date, venue, city, ticket_url, sold_out)
    VALUES (${id}, ${date}, ${venue}, ${city}, ${ticketUrl}, ${soldOut})
  `;

  revalidatePath('/');
  revalidatePath('/live');
  revalidatePath('/admin/shows');
}

export async function updateShow(formData: FormData) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');

  const id = formData.get('id') as string;
  const rawDate = (formData.get('date') as string) ?? '';
  const date = isoDateToDisplay(rawDate);
  const venue = formData.get('venue') as string;
  const city = formData.get('city') as string;
  const ticketUrl = formData.get('ticketUrl') as string;
  const soldOut = formData.get('soldOut') === 'on';

  await sql`
    UPDATE shows
    SET date = ${date},
        venue = ${venue},
        city = ${city},
        ticket_url = ${ticketUrl},
        sold_out = ${soldOut}
    WHERE id = ${id}
  `;

  revalidatePath('/');
  revalidatePath('/live');
  revalidatePath('/admin/shows');
}

export async function deleteShow(formData: FormData) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');

  const id = formData.get('id') as string;
  await sql`DELETE FROM shows WHERE id = ${id}`;

  revalidatePath('/');
  revalidatePath('/live');
  revalidatePath('/admin/shows');
}
