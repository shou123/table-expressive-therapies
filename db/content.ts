import { env } from 'cloudflare:workers';
import { schemaStatements } from './schema';

type SiteBindings = {
  DB: D1Database;
  MEDIA: R2Bucket;
};

type ContentRow = {
  content_key: string;
  payload: string;
  updated_at: string;
  updated_by: string;
};

let schemaReady: Promise<void> | null = null;

function bindings() {
  return env as unknown as SiteBindings;
}

export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = bindings().DB.batch(
      schemaStatements.map((statement) => bindings().DB.prepare(statement)),
    ).then(() => undefined);
  }
  return schemaReady;
}

export async function getAllContent() {
  await ensureSchema();
  const { results } = await bindings().DB.prepare(
    'SELECT content_key, payload, updated_at, updated_by FROM site_content ORDER BY updated_at DESC',
  ).all<ContentRow>();

  return results.map((row) => ({
    key: row.content_key,
    payload: JSON.parse(row.payload) as Record<string, unknown>,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  }));
}

export async function upsertContent(key: string, payload: Record<string, unknown>, email: string) {
  await ensureSchema();
  const now = new Date().toISOString();
  await bindings().DB.prepare(
    `INSERT INTO site_content (content_key, payload, updated_at, updated_by)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(content_key) DO UPDATE SET
       payload = excluded.payload,
       updated_at = excluded.updated_at,
       updated_by = excluded.updated_by`,
  ).bind(key, JSON.stringify(payload), now, email).run();
  return { key, payload, updatedAt: now, updatedBy: email };
}

export async function saveMedia(params: {
  id: string;
  objectKey: string;
  filename: string;
  contentType: string;
  byteSize: number;
  uploadedBy: string;
}) {
  await ensureSchema();
  const uploadedAt = new Date().toISOString();
  await bindings().DB.prepare(
    `INSERT INTO media_assets
       (id, object_key, filename, content_type, byte_size, uploaded_at, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    params.id,
    params.objectKey,
    params.filename,
    params.contentType,
    params.byteSize,
    uploadedAt,
    params.uploadedBy,
  ).run();
  return { ...params, uploadedAt };
}

export function mediaBucket() {
  return bindings().MEDIA;
}
