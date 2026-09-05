import { getAllContent } from '@/db/content';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await getAllContent();
    const content = Object.fromEntries(rows.map((row) => [row.key, row.payload]));
    return Response.json({ content });
  } catch (error) {
    console.error('Unable to load editable content', error);
    return Response.json({ content: {} }, { status: 200 });
  }
}
