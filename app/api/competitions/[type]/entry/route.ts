import { NextRequest } from 'next/server';
import { createCompetitionEntry } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { type } = await params;
  const { content } = await request.json();

  if (!content || content.trim().length === 0) {
    return Response.json({ error: 'Content required' }, { status: 400 });
  }

  const today = new Date().toISOString().split('T')[0];
  const result = createCompetitionEntry(type, user.userId, content.trim(), today);
  return Response.json({ success: true, id: result.lastInsertRowid }, { status: 201 });
}
