import { NextRequest } from 'next/server';
import { toggleReaction, getVideoReactions, getUserReactions } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const counts = getVideoReactions(parseInt(id));
  return Response.json(counts);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { type } = await req.json() as { type: string };
  const VALID = ['fire', 'laugh', 'wow', 'clap'];
  if (!VALID.includes(type)) return Response.json({ error: 'Invalid reaction' }, { status: 400 });
  const result = toggleReaction(parseInt(id), user.userId, type);
  const counts = getVideoReactions(parseInt(id));
  const mine = getUserReactions(parseInt(id), user.userId);
  return Response.json({ ...result, counts, mine });
}
