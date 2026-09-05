import { getChatGPTUser } from '@/app/chatgpt-auth';
import { mediaBucket, saveMedia } from '@/db/content';
import { isAdminUser } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function extensionFor(file: File) {
  const byType: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  return byType[file.type] ?? 'img';
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user || !isAdminUser(user)) {
    return Response.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File) || !ALLOWED_TYPES.has(file.type)) {
    return Response.json({ error: 'Choose a JPG, PNG, WebP, or GIF image.' }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return Response.json({ error: 'Images must be 8 MB or smaller.' }, { status: 413 });
  }

  const id = crypto.randomUUID();
  const objectKey = `${new Date().toISOString().slice(0, 10)}/${id}.${extensionFor(file)}`;
  await mediaBucket().put(objectKey, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
    customMetadata: { originalName: file.name, uploadedBy: user.email },
  });
  await saveMedia({
    id,
    objectKey,
    filename: file.name,
    contentType: file.type,
    byteSize: file.size,
    uploadedBy: user.email,
  });

  return Response.json({
    id,
    filename: file.name,
    url: `/api/media/${objectKey.split('/').map(encodeURIComponent).join('/')}`,
  });
}
