import { NextRequest } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { getAuthUser } from '@/lib/auth';

const UPLOAD_ROOT = path.join(process.env.DATA_PATH || process.cwd(), 'uploads', 'videos');
const MAX_BYTES = 200 * 1024 * 1024; // 200 MB

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 });

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) {
    return Response.json({ error: 'Unsupported file type. Use MP4, WebM, or MOV.' }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json({ error: 'File too large. Max 200 MB.' }, { status: 413 });
  }

  await mkdir(UPLOAD_ROOT, { recursive: true });

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = path.join(UPLOAD_ROOT, filename);

  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  return Response.json({ url: `/api/uploads/videos/${filename}` });
}
