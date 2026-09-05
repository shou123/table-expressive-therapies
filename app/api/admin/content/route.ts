import { getChatGPTUser } from '@/app/chatgpt-auth';
import { getAllContent, upsertContent } from '@/db/content';
import { isAdminUser } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

async function authorizedUser() {
  const user = await getChatGPTUser();
  return user && isAdminUser(user) ? user : null;
}

export async function GET() {
  const user = await authorizedUser();
  if (!user) return Response.json({ error: 'Admin access required.' }, { status: 403 });

  const rows = await getAllContent();
  return Response.json({ rows });
}

export async function PUT(request: Request) {
  const user = await authorizedUser();
  if (!user) return Response.json({ error: 'Admin access required.' }, { status: 403 });

  const body = await request.json().catch(() => null) as {
    key?: unknown;
    payload?: unknown;
  } | null;

  if (!body || typeof body.key !== 'string' || !/^(page|story:|custom-story:)[a-z0-9-]*$/.test(body.key)) {
    return Response.json({ error: 'Invalid content key.' }, { status: 400 });
  }
  if (!body.payload || typeof body.payload !== 'object' || Array.isArray(body.payload)) {
    return Response.json({ error: 'Content must be an object.' }, { status: 400 });
  }
  if (JSON.stringify(body.payload).length > 80_000) {
    return Response.json({ error: 'This content is too large.' }, { status: 413 });
  }

  const row = await upsertContent(body.key, body.payload as Record<string, unknown>, user.email);
  return Response.json({ row });
}
