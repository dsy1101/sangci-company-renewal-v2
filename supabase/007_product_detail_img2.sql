-- ══════════════════════════════════════════════════════════
-- Add a third photo slot so each product item has:
--   image       = catalog card thumbnail
--   detail_img  = main (top) photo in the detail modal
--   detail_img2 = sub  (bottom) photo in the detail modal
-- Run AFTER 005_product_detail.sql.
-- ══════════════════════════════════════════════════════════

alter table product_items
  add column if not exists detail_img2 text default '';
