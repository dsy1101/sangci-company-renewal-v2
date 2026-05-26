# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static, single-page marketing site for **Sangci Company** (Indonesia ↔ Korea trade broker). The public site has no build system, no package manager, and no framework — just HTML, CSS, JS, served as-is by Vercel. Journal and product data live in **Supabase Postgres** and are fetched at runtime by `js/data.js`. A separate **Next.js admin app** ([admin-next/](admin-next/)) deployed at `admin.sangcicompany.com` lets the operator manage that content via a form UI.

## File layout

### Public site (deployed to b2b.sangcicompany.com)
- [index.html](index.html) — page markup + the EDITING GUIDE comment for the non-developer maintainer
- [styles.css](styles.css) — all visual styles, including `:root` design tokens
- [js/i18n.js](js/i18n.js) — `T` object with `en` / `id` / `ko` translations
- [js/data.js](js/data.js) — Supabase client + `loadData()` that populates `vlogs`, `catData`, `coffeeClones`
- [js/app.js](js/app.js) — page switching, renderers, modal handlers, init
- [data/cultivars.json](data/cultivars.json) — coffee cultivar catalogue (the only remaining static data file)

### Admin app (deployed to admin.sangcicompany.com)
- [admin-next/](admin-next/) — Next.js 16 + Supabase Auth + TipTap. Lets the operator CRUD journal entries and product series/items. Read [admin-next/AGENTS.md](admin-next/AGENTS.md) before touching Next.js code (the version has breaking changes from training data).

### Database
- [supabase/](supabase/) — schema migrations + seed SQL. Run 001 → 002 → 003 → 004 → 005 in order against a fresh project.

## Running / previewing

Data is fetched at runtime, so `file://` direct-open no longer works (browsers block `fetch` on `file://`). Use a server:

```
python -m http.server 8000
```

then visit `http://localhost:8000/`. Or push to `main` and let Vercel auto-deploy (~1 min, GitHub repo `dsy1101/sangci-company-renewal-v2`).

No lint, no test suite, no compile step. "Verifying a change" means running a server, opening the page, clicking through the three pages in all three languages, and checking for console errors.

## Architecture — the things you have to know to edit safely

### 1. Async init flow

`js/app.js` ends with an IIFE that `await loadData()` before calling `setLang('ko')` and the renderers. Any code that depends on `vlogs` / `catData` / `coffeeClones` must therefore run **after** that await — i.e., inside renderers or user-triggered handlers, not at script top level.

### 1a. `app.js` functions are intentionally global

`index.html` wires interactions with inline attributes like `onclick="showPage('vlog')"`, `onclick="openModal(${idx})"`, `onclick="openCatalogModal('${clone.id}')"`. Those handlers resolve against `window`, so every function in `js/app.js` must stay at the top level of the script. **Do not** wrap `app.js` in an IIFE, convert it to `<script type="module">`, or move handlers into nested closures — navigation and modals will silently stop working. Same applies to `loadData` / `vlogs` / `catData` / `coffeeClones` in `js/data.js`.

### 2. Page switching

`showPage(name)` hides every `.page`, adds `active` to `#page-<name>`, scrolls to top, and conditionally re-runs renderers. To add a page you must do **all three**: add a nav `<li>` in `index.html`, add a `<div class="page" id="page-XYZ">` in `index.html`, and add the i18n keys in `js/i18n.js`. To remove one, remove all three.

### 3. Trilingual i18n — the `T` object

`en`, `id`, `ko` with `ko` as the default (`setLang('ko')` runs on init at the bottom of `js/app.js`).

- All strings live in `const T = { en: {...}, id: {...}, ko: {...} }` in `js/i18n.js`.
- Mark elements with `data-i18n="key"` (innerHTML) or `data-i18n-ph="key"` (placeholder). `setLang(lang)` walks the DOM and replaces content.
- **When you add a new visible string, add the key to all three locales in `T`.** Missing keys silently fall through to whatever static HTML was already there.
- `setLang` also toggles `body.lang-en` / `body.lang-id` / `body.lang-ko`. Korean has separate font sizing/weight rules throughout `styles.css` (search `body.lang-ko`) because `Noto Sans KR` renders heavier than the Latin serif. **When you add or restyle a heading, add the matching `body.lang-ko` override** or Korean will look wrong.
- **Catalog filter/modal labels are not in `T`.** `renderCatalog` and `openCatalogModal` in `js/app.js` build their yield / bean-size / mucilage / rust / disease / origin labels with inline `currentLang === 'ko' ? '한국어' : englishValue` ternaries (Indonesian falls through to the English branch). To change those, edit the function — not `i18n.js`. If you ever need real Indonesian labels there, refactor to use `T` rather than extending the ternary.

### 4. Dynamic content — Supabase (+ one static JSON)

Journal entries and product series/items live in **Supabase Postgres** (project `viwnjckqtsanuqzjjcen`). `js/data.js` runs three queries in parallel on load:

- `journal` table → `vlogs` array. Newest first via `sort_order desc`. Schema: `date, tag, emoji, thumbnail_url, title_{ko,en,id}, body_{ko,en,id}`. `thumbnail_url` is an image OR video URL (sniffed by extension); the journal grid renders an `<img>` or autoplaying `<video>` accordingly, falling back to the emoji when empty. Renderers: `renderVlog(filter)` for the Journal page (filtered by `tag` in `meeting | field | factory | travel | networking`); `openModal(idx)` for the per-entry modal.
- `product_series` + nested `product_items` → `catData` array (PostgREST embed: `items:product_items(...)`). Each item now has three photo slots — `image` (catalog card thumbnail), `detail_img` (modal main/top), `detail_img2` (modal sub/bottom) — plus detail fields `subtitle_{ko,en,id}`, `detail_desc_{ko,en,id}`, `region`, `process`, `taste_notes_{ko,en,id}`, `fragrance_{ko,en,id}`, `grade`, `moisture`, `body` (0–5 dot rating). Empty spec fields hide their row in the detail modal. Renderers: `renderCategories()` for the Seller page grid; `openItemModal(sIdx, iIdx)` for the full-screen single-column detail modal.
- [data/cultivars.json](data/cultivars.json) → `coffeeClones`. Static file, not in Supabase. Used by `renderCatalog()` + `openCatalogModal()` for the coffee-cultivar catalog UI. Edits must be valid JSON (double-quoted keys, no trailing commas, no comments).

**Content edits = use the admin app**, not direct DB writes or static-file commits. The admin handles Storage uploads for photos, three-language tabs, and the spec table form. RLS policies allow anonymous SELECT (so the public site can read) and authenticated INSERT/UPDATE/DELETE (so only signed-in admins can write).

### 5. Design tokens

Edit colors and fonts in **one place**: `:root` near the top of `styles.css`. Variables in use: `--navy`, `--navy-dark`, `--gold`, `--gold-light`, `--gold-pale`, `--white`, `--off-white`, `--cream`, `--muted`, `--border`, `--glass`, `--serif` (Cormorant Garamond), `--sans` (Montserrat), `--sans-kr` (Noto Sans KR).

### 6. Contact info is hard-coded in HTML

Email `sangcikoreaidn@gmail.com` and phone `+82) 10-5613-0731` appear as literal strings in `index.html` (not in `T`). Update with a find-and-replace.

## Other files in the repo

- **`assets/`** — site images and the hero `video/hero.mp4`. Reference with relative paths from the project root. Product detail photos for the Aceh Gayo series live under `assets/products-detail/`; Mandheling and Kerinci/Robusta photos were uploaded via the admin and live in Supabase Storage (URLs in DB).
- **`Sangci_Company_소개자료_커피.pdf`** — Korean-language company brochure, reference material only.
- **`*.bak`, `index copy*.html`, `verify-*.mjs`, `extract-*.mjs`, `verify-shots/`** — all gitignored. Local-only artifacts from past editing sessions / one-shot helpers. Safe to ignore; not part of the runtime.

## Editing conventions to follow

- Edit the relevant file directly (HTML in `index.html`, styles in `styles.css`, etc.). The split is intentional — it lets future tooling (admin UI / CMS) edit content files without touching code.
- When you change a visible string, update **all three** of `T.en`, `T.id`, `T.ko`. When you add a styled element, consider whether `body.lang-ko` needs an override.
- Keep the EDITING GUIDE comment in `index.html`'s `<head>` accurate if you change file layout, JSON schemas, or contact info location.
- Don't reintroduce inline `<style>` or `<script>` blocks for site logic — the single-file form is what we just moved away from.
