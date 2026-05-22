# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static, single-page marketing site for **Sangci Company** (Indonesia ↔ Korea trade broker). The site has no build system, no package manager, and no framework — just HTML, CSS, JS, and JSON, served as-is by Vercel.

## File layout

- [index.html](index.html) — page markup + the EDITING GUIDE comment for the non-developer maintainer
- [styles.css](styles.css) — all visual styles, including `:root` design tokens
- [js/i18n.js](js/i18n.js) — `T` object with `en` / `id` / `ko` translations
- [js/data.js](js/data.js) — `loadData()` that fetches the three JSON files and assigns to `vlogs`, `catData`, `coffeeClones`
- [js/app.js](js/app.js) — page switching, renderers, modal handlers, init
- [data/journal.json](data/journal.json) — Business Journal entries (was `vlogs`)
- [data/products.json](data/products.json) — Product category series (was `catData`)
- [data/cultivars.json](data/cultivars.json) — Coffee cultivar catalogue (was `coffeeClones`)

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

### 4. Dynamic content — JSON files

The three JSON files are the source of truth for content the maintainer (or eventually the admin UI) edits. `js/data.js` is just a loader and should rarely change.

- **`data/journal.json`** — Business Journal entries. Each item has `date`, `tag`, `title`/`desc` (per-locale `{ en, id, ko }` objects), `img` (URL or `""`), `emoji` (fallback), `youtube` (embed URL or `""`). Newest entry goes at the **top** of the array. Home page shows the first 3 via `renderHomeVlog()`; the Journal page renders all via `renderVlog(filter)` filtered by `tag` (`meeting | field | factory | travel | networking`).
- **`data/products.json`** — drives the Seller/Products catalog via `renderCategories()` / `renderCatalog()`. Items use the same per-locale shape (`{ en, id, ko }`) for `title`, `desc`, `name`, `tags`.
- **`data/cultivars.json`** — coffee cultivar catalogue used by the catalog page filter + detail modal.

Edits must be **valid JSON**: double-quoted keys, no trailing commas, no JS-style comments.

### 5. Design tokens

Edit colors and fonts in **one place**: `:root` near the top of `styles.css`. Variables in use: `--navy`, `--navy-dark`, `--gold`, `--gold-light`, `--gold-pale`, `--white`, `--off-white`, `--cream`, `--muted`, `--border`, `--glass`, `--serif` (Cormorant Garamond), `--sans` (Montserrat), `--sans-kr` (Noto Sans KR).

### 6. Contact info is hard-coded in HTML

Email `sangcikoreaidn@gmail.com` and phone `+82) 10-5613-0731` appear as literal strings in `index.html` (not in `T`). Update with a find-and-replace.

## Other files in the repo

- **`incore-website_sample.html`** — an older snapshot used as the input file for Python helper scripts that no longer run. **It is not the live site**; do not edit it expecting changes to show up.
- **`index.html.bak`, `index.html.pre-split.bak`, `index copy.html`** — gitignored manual backups from prior editing sessions. Ignore unless explicitly asked to diff against a prior version.
- **`extract-data.mjs`, `verify-split.mjs`, `verify-phase2.mjs`, `verify-shots/`** — gitignored one-shot helper scripts from the JS→JSON split migration. They are not part of the runtime, not used in CI, and safe to ignore. Don't add new "verify" scripts here unless you also un-gitignore them; otherwise they'll quietly disappear on a fresh clone.
- **`assets/`** — images and the hero `video/hero.mp4`. Reference with relative paths from the project root.
- **`Sangci_Company_소개자료_커피.pdf`** — Korean-language company brochure, reference material only.

## Editing conventions to follow

- Edit the relevant file directly (HTML in `index.html`, styles in `styles.css`, etc.). The split is intentional — it lets future tooling (admin UI / CMS) edit content files without touching code.
- When you change a visible string, update **all three** of `T.en`, `T.id`, `T.ko`. When you add a styled element, consider whether `body.lang-ko` needs an override.
- Keep the EDITING GUIDE comment in `index.html`'s `<head>` accurate if you change file layout, JSON schemas, or contact info location.
- Don't reintroduce inline `<style>` or `<script>` blocks for site logic — the single-file form is what we just moved away from.
