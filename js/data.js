// ══════════════════════════════════════════════════════════
// SITE DATA LOADER  (Supabase-backed)
// ══════════════════════════════════════════════════════════
//
// Journal and product data live in Supabase Postgres now.
// Coffee cultivars (data/cultivars.json) is still a static file.
//
// URL + anon key are *publishable* — safe to expose in client code.
// Row Level Security on Supabase protects writes (only authenticated
// admin users can INSERT/UPDATE/DELETE; everyone can SELECT).
//
// These variables start empty and are populated by loadData() before
// any renderer runs. app.js init() awaits loadData() first.
// ══════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://viwnjckqtsanuqzjjcen.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7JWxdRUYEGPSriNfiff5Ng_nTzJ-xi6';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let vlogs = [];
let catData = [];
let coffeeClones = [];

async function loadData() {
  const [journalRes, seriesRes, cultivarsRes] = await Promise.all([
    sb.from('journal')
      .select('id, date, tag, emoji, thumbnail_url, title_ko, title_en, title_id, body_ko, body_en, body_id')
      .order('sort_order', { ascending: false }),
    sb.from('product_series')
      .select('series_id, title_ko, title_en, title_id, desc_ko, desc_en, desc_id, items:product_items(image, detail_img, detail_img2, name_ko, name_en, name_id, tags_ko, tags_en, tags_id, desc_ko, desc_en, desc_id, subtitle_ko, subtitle_en, subtitle_id, detail_desc_ko, detail_desc_en, detail_desc_id, region, process, taste_notes_ko, taste_notes_en, taste_notes_id, fragrance_ko, fragrance_en, fragrance_id, grade, moisture, body, sort_order)')
      .order('sort_order', { ascending: true }),
    fetch('data/cultivars.json', { cache: 'no-cache' }).then(r => r.json()),
  ]);

  if (journalRes.error) throw new Error('journal: ' + journalRes.error.message);
  if (seriesRes.error)  throw new Error('product_series: ' + seriesRes.error.message);

  // Journal rows are already in the flat shape (title_ko / body_ko / etc.)
  // that the renderers in app.js expect — pass through unchanged.
  vlogs = journalRes.data || [];

  // Product series + items: rehydrate to the nested { title:{ko,en,id}, items:[{name:{ko,en,id},...}] }
  // shape the existing renderCategories() in app.js was written against.
  catData = (seriesRes.data || []).map((s) => ({
    id:    s.series_id,
    title: { ko: s.title_ko, en: s.title_en, id: s.title_id },
    desc:  { ko: s.desc_ko,  en: s.desc_en,  id: s.desc_id  },
    items: (s.items || [])
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((it) => ({
        image:      it.image,                // catalog card thumbnail
        detailImg:  it.detail_img  || '',    // modal main (top)
        detailImg2: it.detail_img2 || '',    // modal sub  (bottom)
        name:  { ko: it.name_ko, en: it.name_en, id: it.name_id },
        tags:  { ko: it.tags_ko || [], en: it.tags_en || [], id: it.tags_id || [] },
        desc:  { ko: it.desc_ko, en: it.desc_en, id: it.desc_id },
        // Detail-modal fields (any may be empty string / 0).
        subtitle:    { ko: it.subtitle_ko    || '', en: it.subtitle_en    || '', id: it.subtitle_id    || '' },
        detailDesc:  { ko: it.detail_desc_ko || '', en: it.detail_desc_en || '', id: it.detail_desc_id || '' },
        tasteNotes:  { ko: it.taste_notes_ko || '', en: it.taste_notes_en || '', id: it.taste_notes_id || '' },
        fragrance:   { ko: it.fragrance_ko   || '', en: it.fragrance_en   || '', id: it.fragrance_id   || '' },
        region:    it.region   || '',
        process:   it.process  || '',
        grade:     it.grade    || '',
        moisture:  it.moisture || '',
        body:      it.body     || 0,
      })),
  }));

  coffeeClones = cultivarsRes;
}
