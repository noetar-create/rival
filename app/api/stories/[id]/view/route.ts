import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { markStoryViewed } from '@/lib/db';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ ok: true }); // silent for anon
  const { id } = await params;
  markStoryViewed(parseInt(id), user.userId);
  return Response.json({ ok: true });
}
