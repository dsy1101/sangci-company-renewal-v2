// Generate INSERT SQL from data/journal.json + data/products.json
// Output: supabase/002_seed.sql
import fs from 'node:fs';

const journal = JSON.parse(fs.readFileSync('data/journal.json', 'utf8')).entries;
const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8')).series;

// Postgres single-quoted string literal escaping
const q = (s) => "'" + String(s ?? '').replace(/'/g, "''") + "'";
const qJson = (obj) => "'" + JSON.stringify(obj ?? []).replace(/'/g, "''") + "'::jsonb";

let sql = '-- Auto-generated from data/journal.json + data/products.json\n';
sql += '-- Run AFTER 001_schema.sql in Supabase SQL Editor.\n';
sql += '-- Idempotent-safe via TRUNCATE — re-running wipes and reloads.\n\n';

sql += 'truncate table product_items, product_series, journal restart identity cascade;\n\n';

// ── JOURNAL ──────────────────────────────────────────────
sql += '-- JOURNAL entries (newest first preserved via sort_order)\n';
journal.forEach((e, i) => {
  const sort = (journal.length - i) * 10; // higher = newer at top
  sql += `insert into journal (date, tag, emoji, title_ko, title_en, title_id, body_ko, body_en, body_id, sort_order) values (`;
  sql += [
    q(e.date),
    q(e.tag),
    q(e.emoji || '📝'),
    q(e.title_ko),
    q(e.title_en || ''),
    q(e.title_id || ''),
    q(e.body_ko),
    q(e.body_en || ''),
    q(e.body_id || ''),
    sort,
  ].join(', ');
  sql += ');\n';
});
sql += '\n';

// ── PRODUCT SERIES + ITEMS ───────────────────────────────
sql += '-- PRODUCT SERIES + ITEMS (use CTEs to wire foreign keys)\n';
products.forEach((s, si) => {
  const seriesSort = (si + 1) * 10;
  sql += `\nwith s as (\n  insert into product_series (series_id, title_ko, title_en, title_id, desc_ko, desc_en, desc_id, sort_order) values (`;
  sql += [
    s.id,
    q(s.title?.ko ?? s.title_ko ?? ''),
    q(s.title?.en ?? s.title_en ?? ''),
    q(s.title?.id ?? s.title_id ?? ''),
    q(s.desc?.ko ?? s.desc_ko ?? ''),
    q(s.desc?.en ?? s.desc_en ?? ''),
    q(s.desc?.id ?? s.desc_id ?? ''),
    seriesSort,
  ].join(', ');
  sql += `) returning id\n)\n`;
  sql += `insert into product_items (series_id, image, detail_img, name_ko, name_en, name_id, tags_ko, tags_en, tags_id, desc_ko, desc_en, desc_id, sort_order)\nvalues\n`;
  const itemRows = (s.items || []).map((it, ii) => {
    const itemSort = (ii + 1) * 10;
    return `  ((select id from s), ${q(it.image)}, ${q(it.detailImg || '')}, `
      + `${q(it.name?.ko ?? it.name_ko ?? '')}, ${q(it.name?.en ?? it.name_en ?? '')}, ${q(it.name?.id ?? it.name_id ?? '')}, `
      + `${qJson(it.tags?.ko ?? it.tags_ko ?? [])}, ${qJson(it.tags?.en ?? it.tags_en ?? [])}, ${qJson(it.tags?.id ?? it.tags_id ?? [])}, `
      + `${q(it.desc?.ko ?? it.desc_ko ?? '')}, ${q(it.desc?.en ?? it.desc_en ?? '')}, ${q(it.desc?.id ?? it.desc_id ?? '')}, `
      + `${itemSort})`;
  });
  sql += itemRows.join(',\n') + ';\n';
});

fs.writeFileSync('supabase/002_seed.sql', sql);
console.log(`Wrote supabase/002_seed.sql (${sql.length} bytes, ${journal.length} journal entries, ${products.length} product series with ${products.reduce((n,s)=>n+s.items.length,0)} items total)`);
