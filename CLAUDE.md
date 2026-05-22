# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static, single-page marketing site for **Sangci Company** (Indonesia ↔ Korea trade broker). The entire site is one self-contained file: [index.html](index.html) (~4500 lines) holds the HTML, inline `<style>`, and inline `<script>` with all data, i18n, and page logic. There is no build system, no package manager, and no framework.

## Running / previewing

- Open [index.html](index.html) directly in a browser, **or**
- Serve the directory statically, e.g. `python -m http.server 8000` then visit `http://localhost:8000/`.
- Deployment target is Vercel — the project is already linked via `.vercel/` (gitignored). No build step is configured; Vercel serves the static files as-is.

No lint, no test suite, no compile step exists. "Verifying a change" means opening the file in a browser and clicking through the three pages in all three languages.

## Architecture — the things you have to know to edit safely

### 1. Single-file structure of `index.html`

The file is organized top-to-bottom as:
1. `<head>` with Google Fonts + a large ASCII "EDITING GUIDE" comment block (lines ~12–58). **Read that comment** before structural edits — it's the source of truth for how the maintainer expects edits to be made.
2. One giant inline `<style>` block defining everything via CSS custom properties on `:root` (`--navy`, `--gold`, `--cream`, fonts, etc.).
3. `<body>` containing the fixed lang bar, nav, and **three page `<div>`s**: `#page-home`, `#page-seller`, `#page-vlog`. Only one has the `active` class at a time.
4. Modals (vlog modal, product detail modal) at the bottom of `<body>`.
5. One inline `<script>` with all data and behavior.

### 2. Page switching

`showPage(name)` ([index.html:4415](index.html#L4415)) hides every `.page`, adds `active` to `#page-<name>`, scrolls to top, and conditionally calls `renderCatalog()` / `renderVlog(...)` / `renderHomeVlog()`. To add a page you must do **all three**: add a nav `<li>`, add a `<div class="page" id="page-XYZ">`, and add the i18n keys (see below). To remove one, remove all three.

### 3. Trilingual i18n — the `T` object

The site supports `en`, `id`, `ko` with `ko` as the default ([index.html:3821](index.html#L3821), `setLang('ko')` runs on init at the bottom of the script).

- All strings live in `const T = { en: {...}, id: {...}, ko: {...} }` starting at [index.html:3437](index.html#L3437).
- Mark elements with `data-i18n="key"` (innerHTML) or `data-i18n-ph="key"` (placeholder). `setLang(lang)` ([index.html:3822](index.html#L3822)) walks the DOM and replaces content.
- **When you add a new visible string, you must add the key to all three locales in `T`.** Missing keys silently fall through to whatever static HTML was already there.
- `setLang` also toggles `body.lang-en` / `body.lang-id` / `body.lang-ko`. Korean has separate font sizing/weight rules throughout the stylesheet (search for `body.lang-ko`) because `Noto Sans KR` renders heavier than the Latin serif. **When you add or restyle a heading, add the matching `body.lang-ko` override** or Korean will look wrong.

### 4. Dynamic content arrays

Two JS arrays drive rendered grids — edit data here, not in the markup:

- **`const vlogs = [...]`** at [index.html:3369](index.html#L3369) — Business Journal entries. Each item has `date`, `tag`, `title`/`desc` (per-locale objects), `img` (URL or `""`), `emoji` (fallback), `youtube` (embed URL or `""`). Newest entry goes at the **top** of the array. Home page shows the first 3 via `renderHomeVlog()`; the Journal page renders all via `renderVlog(filter)` filtered by `tag` (`meeting | field | factory | travel | networking`).
- **`catData`** drives the Seller/Products catalog via `renderCategories()` / `renderCatalog()`. Items use the same per-locale shape (`{ en, id, ko }`) for `title`, `desc`, `name`, `tags`.

### 5. Design tokens

Edit colors and fonts in **one place** only: `:root` near [index.html:70](index.html#L70). Variables in use: `--navy`, `--navy-dark`, `--gold`, `--gold-light`, `--gold-pale`, `--white`, `--off-white`, `--cream`, `--muted`, `--border`, `--glass`, `--serif` (Cormorant Garamond), `--sans` (Montserrat), `--sans-kr` (Noto Sans KR).

### 6. Contact info is hard-coded

Email `sangcikoreaidn@gmail.com` and phone `+82) 10-5613-0731` appear as literal strings in the HTML (not in `T`). Update with a find-and-replace across the file.

## Other files in the repo

- **`incore-website_sample.html`** — an older snapshot used as the input file for the Python helper scripts below. **It is not the live site**; do not edit it expecting changes to show up. `index.html` is the live file.
- **`index copy.html`, `index copy 2.html`, `index.html.bak`, `temp_fixed.html`** — manual backups from prior editing sessions. Ignore unless explicitly asked to diff against a prior version.
- **`fix*.py`, `update_*.py`, `restore*.py`** — one-off Python scripts the maintainer wrote to perform bulk find-and-replace edits (translation updates, section rewrites, encoding fixes) against `incore-website_sample.html`. They are **not a build pipeline** and not part of any workflow — they're historical artifacts. Don't run them unless the user specifically asks. Don't model new changes on this pattern; edit `index.html` directly.
- **`assets/`** — images and the hero `video/hero.mp4`. Reference with relative paths from the project root.
- **`Sangci_Company_소개자료_커피.pdf`** — Korean-language company brochure, reference material only.

## Editing conventions to follow

- Edit `index.html` directly with the Edit tool. Do not introduce a build step, a bundler, external CSS/JS files, or a framework unless the user explicitly asks — the single-file design is intentional and the in-file EDITING GUIDE comment is written for a non-developer maintainer.
- When you change a visible string, update **all three** of `T.en`, `T.id`, `T.ko`. When you add a styled element, consider whether `body.lang-ko` needs an override.
- Keep the EDITING GUIDE comment at the top of `<head>` accurate if you change structure (page IDs, vlog schema, contact-info location, color tokens).
