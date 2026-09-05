import { mediaBucket } from '@/db/content';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const { key } = await context.params;
  const object = await mediaBucket().get(key.join('/'));
  if (!object) return new Response('Image not found.', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  return new Response(object.body, { headers });
}
