import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getUserCollections, createCollection } from '@/lib/db';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  return Response.json(getUserCollections(user.userId));
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { name } = await req.json() as { name: string };
  if (!name?.trim()) return Response.json({ error: 'Name required' }, { status: 400 });
  const result = createCollection(user.userId, name.trim());
  return Response.json({ ok: true, id: result.lastInsertRowid }, { status: 201 });
}
