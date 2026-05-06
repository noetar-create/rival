import { NextRequest } from 'next/server';
import { incrementViews } from '@/lib/db';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    incrementViews(parseInt(id));
  } catch {}
  return Response.json({ ok: true });
}
