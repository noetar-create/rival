import { NextRequest } from 'next/server';
import { stat, open } from 'fs/promises';
import path from 'path';

const UPLOAD_ROOT = path.join(process.env.DATA_PATH || process.cwd(), 'uploads');

const MIME: Record<string, string> = {
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
  webm: 'video/webm',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filepath: string[] }> }
) {
  const { filepath } = await params;
  const fullPath = path.join(UPLOAD_ROOT, ...filepath);

  // Prevent path traversal
  if (!fullPath.startsWith(UPLOAD_ROOT)) {
    return new Response('Forbidden', { status: 403 });
  }

  let size: number;
  try {
    const s = await stat(fullPath);
    size = s.size;
  } catch {
    return new Response('Not found', { status: 404 });
  }

  const ext = fullPath.split('.').pop()?.toLowerCase() ?? '';
  const contentType = MIME[ext] ?? 'application/octet-stream';
  const range = req.headers.get('range');

  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : size - 1;
    const chunkSize = end - start + 1;

    const fh = await open(fullPath);
    const buf = Buffer.alloc(chunkSize);
    await fh.read(buf, 0, chunkSize, start);
    await fh.close();

    return new Response(buf, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunkSize),
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800',
      },
    });
  }

  const fh = await open(fullPath);
  const buf = Buffer.alloc(size);
  await fh.read(buf, 0, size, 0);
  await fh.close();

  return new Response(buf, {
    headers: {
      'Content-Length': String(size),
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=604800',
    },
  });
}
