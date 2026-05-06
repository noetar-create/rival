import { NextRequest } from 'next/server';
import { createReport, checkReportThreshold } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { reason } = await req.json() as { reason: string };
  const videoId = parseInt(id);
  const result = createReport(videoId, user.userId, reason ?? 'inappropriate');
  if (result.reported) checkReportThreshold(videoId);
  return Response.json(result);
}
