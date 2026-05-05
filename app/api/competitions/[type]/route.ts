import { NextRequest } from 'next/server';
import { getCompetitionEntries } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const today = new Date().toISOString().split('T')[0];
  const entries = getCompetitionEntries(type, today);
  return Response.json({ entries, type, date: today });
}
