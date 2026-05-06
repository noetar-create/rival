import { NextRequest } from 'next/server';
import { getUserNotifications, getUnreadNotificationCount, markAllNotificationsRead } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const notifications = getUserNotifications(user.userId);
  const unread = getUnreadNotificationCount(user.userId);
  return Response.json({ notifications, unread });
}

export async function POST(_request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  markAllNotificationsRead(user.userId);
  return Response.json({ success: true });
}
