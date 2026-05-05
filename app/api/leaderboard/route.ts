import { getWeeklyLeaderboard } from '@/lib/db';

export async function GET() {
  const leaderboard = getWeeklyLeaderboard();
  return Response.json({ leaderboard });
}
