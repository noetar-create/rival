import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { updateUserPrivacy } from '@/lib/db';

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { is_private } = await req.json() as { is_private: boolean };
  updateUserPrivacy(user.userId, is_private);
  return Response.json({ ok: true });
}
