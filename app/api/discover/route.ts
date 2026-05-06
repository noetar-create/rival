import { getAuthUser } from '@/lib/auth';
import { getRecommendedCreators } from '@/lib/db';

export async function GET() {
  const user = await getAuthUser();
  const creators = getRecommendedCreators(user?.userId ?? null, 8);
  return Response.json(creators);
}
