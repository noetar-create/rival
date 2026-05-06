import { NextRequest } from 'next/server';
import { markNotificationRead } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  markNotificationRead(parseInt(id), user.userId);
  return Response.json({ success: true });
}
