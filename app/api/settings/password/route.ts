import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAuthUser } from '@/lib/auth';
import { getUserById, updateUserPassword } from '@/lib/db';

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { current_password, new_password } = await req.json() as { current_password: string; new_password: string };
  if (!current_password || !new_password) return Response.json({ error: 'Both fields required' }, { status: 400 });
  if (new_password.length < 8) return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  const profile = getUserById(user.userId);
  if (!profile) return Response.json({ error: 'Not found' }, { status: 404 });
  const valid = await bcrypt.compare(current_password, profile.password_hash);
  if (!valid) return Response.json({ error: 'Current password is incorrect' }, { status: 400 });
  const hash = await bcrypt.hash(new_password, 10);
  updateUserPassword(user.userId, hash);
  return Response.json({ ok: true });
}
