'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { isAuthenticated } from '../auth';

export async function updateBio(formData: FormData) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');

  const text = formData.get('text') as string;

  await sql`
    INSERT INTO bio (id, text) VALUES ('main', ${text})
    ON CONFLICT (id) DO UPDATE SET text = ${text}
  `;

  // Handle awards: delete all, re-insert from form data
  // Awards come in as award_0, award_1, ... with optional awardId_0, awardId_1
  const awardsToSave: { id: string; text: string; sortOrder: number }[] = [];
  let i = 0;
  while (formData.has(`award_${i}`)) {
    const awardText = formData.get(`award_${i}`) as string;
    const awardId = (formData.get(`awardId_${i}`) as string) || Date.now().toString() + i;
    if (awardText.trim()) {
      awardsToSave.push({ id: awardId, text: awardText.trim(), sortOrder: i });
    }
    i++;
  }

  // Delete all awards and re-insert (simplest approach for small data)
  await sql`DELETE FROM awards`;
  for (const award of awardsToSave) {
    await sql`
      INSERT INTO awards (id, text, sort_order)
      VALUES (${award.id}, ${award.text}, ${award.sortOrder})
    `;
  }

  revalidatePath('/');
  revalidatePath('/bio');
  revalidatePath('/admin/bio');
}
