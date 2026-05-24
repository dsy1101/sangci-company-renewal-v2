// ══════════════════════════════════════════════════════════
// SITE DATA LOADER
// ══════════════════════════════════════════════════════════
//
// Journal posts, product categories, and coffee cultivars live in
// JSON files under data/. Edit them there.
//
//   data/journal.json    — Business Journal entries (vlogs)
//   data/products.json   — Product category series (catData)
//   data/cultivars.json  — Coffee cultivar catalogue (coffeeClones)
//
// journal.json and products.json are written by Decap CMS as a root
// object with one key (entries / series). cultivars.json is still a
// bare array. The `?? json` fallback keeps both shapes working.
//
// These variables start empty and are populated by loadData() before
// any renderer runs. app.js init() awaits loadData() first.
// ══════════════════════════════════════════════════════════

let vlogs = [];
let catData = [];
let coffeeClones = [];

async function loadData() {
  const fetchJson = async (path) => {
    const r = await fetch(path, { cache: 'no-cache' });
    if (!r.ok) throw new Error(`${path} → ${r.status}`);
    return r.json();
  };
  const [journal, products, cultivars] = await Promise.all([
    fetchJson('data/journal.json'),
    fetchJson('data/products.json'),
    fetchJson('data/cultivars.json'),
  ]);
  vlogs = journal.entries ?? journal;
  catData = products.series ?? products;
  coffeeClones = cultivars;
}
