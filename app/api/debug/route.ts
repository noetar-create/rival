import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { existsSync, readdirSync } from 'fs';
import path from 'path';

export async function GET() {
  const dataPath = process.env.DATA_PATH || process.cwd();
  const dbPath = path.join(dataPath, 'rival.db');
  const dbExists = existsSync(dbPath);
  const uploadDir = path.join(process.env.DATA_PATH || path.join(process.cwd(), 'public'), 'uploads', 'videos');
  const dirExists = existsSync(uploadDir);
  const files = dirExists ? readdirSync(uploadDir) : [];

  if (!dbExists) {
    return NextResponse.json({ error: 'Database does not exist', dbPath, uploadDirExists: dirExists, files, cwd: process.cwd() });
  }

  const db = new Database(dbPath, { readonly: true });
  const videos = db.prepare('SELECT id, title, file_url, created_at FROM videos ORDER BY created_at DESC LIMIT 10').all();
  const userCount = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;
  db.close();

  return NextResponse.json({ videos, userCount, uploadDirExists: dirExists, files, dbPath, cwd: process.cwd() });
}
