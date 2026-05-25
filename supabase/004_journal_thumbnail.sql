-- ══════════════════════════════════════════════════════════
-- Add `thumbnail_url` to journal entries.
-- One field, holds either an image URL or a video URL.
-- Renderers detect the type from the file extension.
-- Run this in SQL Editor AFTER 003_storage.sql.
-- ══════════════════════════════════════════════════════════

alter table journal
  add column if not exists thumbnail_url text default '';
