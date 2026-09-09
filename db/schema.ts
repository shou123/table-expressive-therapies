export const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS site_content (
    content_key TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    updated_by TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_site_content_updated_at
    ON site_content(updated_at DESC)`,
  `CREATE TABLE IF NOT EXISTS media_assets (
    id TEXT PRIMARY KEY,
    object_key TEXT NOT NULL UNIQUE,
    filename TEXT NOT NULL,
    content_type TEXT NOT NULL,
    byte_size INTEGER NOT NULL,
    uploaded_at TEXT NOT NULL,
    uploaded_by TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_media_assets_uploaded_at
    ON media_assets(uploaded_at DESC)`,
] as const;
