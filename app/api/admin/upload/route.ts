import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  // Auth check
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  const password = process.env.ADMIN_PASSWORD ?? '';
  const expected = createHash('sha256').update(password).digest('hex');
  if (session !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
    const timestamp = Date.now();
    const filename = `${timestamp}-${originalName}`;

    const uploadDir = join(process.cwd(), 'public', 'images');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), buffer);

    return NextResponse.json({ path: `/images/${filename}` });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
