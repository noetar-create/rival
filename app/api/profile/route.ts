import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { updateUserProfile, getUserById } from '@/lib/db';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const profile = getUserById(user.userId);
  if (!profile) return Response.json({ error: 'Not found' }, { status: 404 });
  const { password_hash: _, ...safe } = profile;
  return Response.json(safe);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { display_name, bio, website } = await req.json() as { display_name?: string; bio?: string; website?: string };
  updateUserProfile(user.userId, display_name?.trim() || null, bio?.trim() || null, website?.trim() || null);
  return Response.json({ ok: true });
}
