import { getAuthUser } from '@/lib/auth';
import { getConversations, getUnreadMessageCount } from '@/lib/db';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const conversations = getConversations(user.userId);
  const unread = getUnreadMessageCount(user.userId);
  return Response.json({ conversations, unread });
}
