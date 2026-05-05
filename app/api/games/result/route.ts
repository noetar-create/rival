import { NextRequest } from 'next/server';
import { recordGameResult } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

const GAME_THRESHOLDS: Record<string, number> = {
  typing: 30,      // 30 WPM
  trivia: 6,       // 6/10 correct
  reaction: 350,   // under 350ms (score = ms, lower is better)
  memory: 5,       // recall 5+ items
  emoji: 5,        // 5+ correct
  spot: 3,         // find 3+ differences
  chess: 1,        // just get it right
};

function isWin(gameType: string, score: number): boolean {
  if (gameType === 'reaction') {
    return score < (GAME_THRESHOLDS[gameType] || 350);
  }
  return score >= (GAME_THRESHOLDS[gameType] || 1);
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { game_type, score } = await request.json();
  if (!game_type || score === undefined) {
    return Response.json({ error: 'game_type and score required' }, { status: 400 });
  }

  const won = isWin(game_type, score);
  const pointsEarned = won ? 1 : 0;

  recordGameResult(user.userId, game_type, score, won, pointsEarned);

  return Response.json({ won, points_earned: pointsEarned, score });
}
