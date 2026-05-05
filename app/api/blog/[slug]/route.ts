import { NextRequest } from 'next/server';
import { getBlogPost } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ post });
}
