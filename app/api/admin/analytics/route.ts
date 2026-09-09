import { getChatGPTUser } from '@/app/chatgpt-auth';
import { getVisitorAnalytics } from '@/db/analytics';
import { isAdminUser } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getChatGPTUser();
  if (!user || !isAdminUser(user)) {
    return Response.json({ error: 'Admin access required.' }, { status: 403 });
  }

  return Response.json({ analytics: await getVisitorAnalytics() });
}
