import { NextRequest } from 'next/server';
import { getUserBookmarks } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const bookmarks = getUserBookmarks(user.userId);
  return Response.json({ bookmarks });
}
