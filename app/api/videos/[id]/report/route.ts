import { NextRequest } from 'next/server';
import { createReport } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { reason } = await req.json() as { reason: string };
  const result = createReport(parseInt(id), user.userId, reason ?? 'inappropriate');
  return Response.json(result);
}
