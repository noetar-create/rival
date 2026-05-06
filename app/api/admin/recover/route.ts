import { NextRequest, NextResponse } from 'next/server';
import { readdir, unlink, rm } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  if (req.headers.get('x-admin-secret') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dataPath = process.env.DATA_PATH || process.cwd();
  const uploadDir = path.join(dataPath, 'uploads', 'videos');
  const walPath = path.join(dataPath, 'rival.db-wal');
  const shmPath = path.join(dataPath, 'rival.db-shm');

  const results: Record<string, string> = {};

  // Delete ALL upload files to free disk
  try {
    const files = await readdir(uploadDir);
    await Promise.allSettled(files.map(f => unlink(path.join(uploadDir, f))));
    results.uploads = `Deleted ${files.length} files`;
  } catch (e) {
    results.uploads = `Error: ${e}`;
  }

  // Delete WAL and SHM files to allow SQLite to recover
  for (const [name, fp] of [['wal', walPath], ['shm', shmPath]] as const) {
    if (existsSync(fp)) {
      try { await unlink(fp); results[name] = 'Deleted'; }
      catch (e) { results[name] = `Error: ${e}`; }
    } else {
      results[name] = 'Not found';
    }
  }

  return NextResponse.json({ ok: true, results });
}
