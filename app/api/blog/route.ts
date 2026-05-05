import { getBlogPosts } from '@/lib/db';

export async function GET() {
  const posts = getBlogPosts();
  return Response.json({ posts });
}
