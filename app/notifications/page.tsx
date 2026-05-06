import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { getUserNotifications } from '@/lib/db';
import type { Notification } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Your Rival notifications — likes, competition votes, and more.',
  robots: { index: false, follow: false },
};

const typeConfig: Record<string, { icon: string; color: string }> = {
  video_like: { icon: '❤️', color: 'border-pink-500/20 bg-pink-500/5' },
  competition_vote: { icon: '🗳️', color: 'border-purple-500/20 bg-purple-500/5' },
  competition_win: { icon: '🏆', color: 'border-yellow-500/20 bg-yellow-500/5' },
  weekly_recap: { icon: '📊', color: 'border-blue-500/20 bg-blue-500/5' },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

export default async function NotificationsPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect('/login');
  }

  let notifications: Notification[] = [];
  try {
    notifications = getUserNotifications(user.userId);
  } catch {}

  const unread = notifications.filter((n) => n.read === 0).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">🔔 Notifications</h1>
          {unread > 0 && (
            <p className="text-purple-400 text-sm font-medium">{unread} unread</p>
          )}
        </div>
        {unread > 0 && (
          <form action="/api/notifications" method="POST">
            <button
              type="submit"
              className="text-sm text-white/40 hover:text-white px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-200"
            >
              Mark all read
            </button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-24 rounded-3xl bg-white/5 border border-white/10">
          <div className="text-5xl mb-4">🔔</div>
          <h2 className="text-xl font-bold text-white mb-2">No notifications yet</h2>
          <p className="text-white/40">When someone likes your video or votes on your entry, you&apos;ll see it here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const config = typeConfig[notification.type] ?? { icon: '🔔', color: 'border-white/10 bg-white/5' };
            return (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-2xl border ${config.color} ${
                  notification.read === 0 ? 'ring-1 ring-purple-500/30' : ''
                } transition-all duration-200`}
              >
                <span className="text-2xl mt-0.5">{config.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${notification.read === 0 ? 'text-white' : 'text-white/60'}`}>
                    {notification.message}
                  </p>
                  <p className="text-white/30 text-xs mt-1">{timeAgo(notification.created_at)}</p>
                </div>
                {notification.read === 0 && (
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
