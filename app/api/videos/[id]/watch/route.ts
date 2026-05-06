import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { recordWatchEvent } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  const { id } = await params;
  const { seconds, source } = await req.json() as { seconds: number; source?: string };
  recordWatchEvent(parseInt(id), user?.userId ?? null, seconds, source || 'feed');
  return Response.json({ ok: true });
}
