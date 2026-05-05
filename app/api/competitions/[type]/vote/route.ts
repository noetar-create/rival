import { NextRequest } from 'next/server';
import { voteOnEntry } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { entry_id } = await request.json();
  if (!entry_id) return Response.json({ error: 'entry_id required' }, { status: 400 });

  const result = voteOnEntry(entry_id, user.userId);
  if (!result.voted) {
    return Response.json({ error: result.error }, { status: 409 });
  }
  return Response.json({ success: true });
}
