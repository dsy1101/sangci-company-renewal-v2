-- ══════════════════════════════════════════════════════════
-- Product item DETAIL fields — subtitle, long description,
-- and the 7-field spec table (Region, Process, Taste Notes,
-- Fragrance, Grade, Moisture, Body 0–5).
-- The existing `detail_img` column is reused as the second
-- product photo in the detail modal. The existing `image`
-- stays the card thumbnail (= first photo in detail modal).
-- Run this in SQL Editor AFTER 004_journal_thumbnail.sql.
-- ══════════════════════════════════════════════════════════

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
