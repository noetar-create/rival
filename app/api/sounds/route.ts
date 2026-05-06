import { getTrendingSounds } from '@/lib/db';

export async function GET() {
  const sounds = getTrendingSounds(30);
  return Response.json(sounds);
}
