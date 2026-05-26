-- ══════════════════════════════════════════════════════════
-- Schema additions after the initial 001_schema.sql + 002_seed.sql.
-- All idempotent (ADD COLUMN IF NOT EXISTS). Safe to re-run.
-- Run AFTER 003_storage.sql.
-- ══════════════════════════════════════════════════════════

-- ── 1) Journal: Instagram-style thumbnail (image OR video URL) ──
alter table journal
  add column if not exists thumbnail_url text default '';

-- ── 2) Product items: detail-modal fields ──────────────────
--   subtitle / detail_desc : 3 langs each
--   region / process       : single value (proper nouns)
--   taste_notes / fragrance: 3 langs each
--   grade / moisture       : single value
--   body                   : 0-5 dot rating
alter table product_items
  add column if not exists subtitle_ko    text default '',
  add column if not exists subtitle_en    text default '',
  add column if not exists subtitle_id    text default '',
  add column if not exists detail_desc_ko text default '',
  add column if not exists detail_desc_en text default '',
  add column if not exists detail_desc_id text default '',
  add column if not exists region         text default '',
  add column if not exists process        text default '',
  add column if not exists taste_notes_ko text default '',
  add column if not exists taste_notes_en text default '',
  add column if not exists taste_notes_id text default '',
  add column if not exists fragrance_ko   text default '',
  add column if not exists fragrance_en   text default '',
  add column if not exists fragrance_id   text default '',
  add column if not exists grade          text default '',
  add column if not exists moisture       text default '',
  add column if not exists body           int  default 0
    check (body between 0 and 5);

-- ── 3) Product items: third photo slot ─────────────────────
--   image       = catalog card thumbnail
--   detail_img  = modal main (top) photo
--   detail_img2 = modal sub  (bottom) photo
alter table product_items
  add column if not exists detail_img2 text default '';
