-- ══════════════════════════════════════════════════════════
-- Sangci CMS — initial schema
-- Run this in Supabase Dashboard → SQL Editor → New query
-- ══════════════════════════════════════════════════════════

-- ── JOURNAL (저널 글) ─────────────────────────────────────
create table if not exists journal (
  id          uuid primary key default gen_random_uuid(),
  date        text        not null,
  tag         text        not null check (tag in ('meeting','field','factory','travel','networking')),
  emoji       text        default '📝',
  title_ko    text        not null,
  title_en    text        default '',
  title_id    text        default '',
  body_ko     text        not null,
  body_en     text        default '',
  body_id     text        default '',
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists journal_sort_order_idx on journal (sort_order desc, created_at desc);

-- ── PRODUCT SERIES (제품 시리즈) ──────────────────────────
create table if not exists product_series (
  id          uuid primary key default gen_random_uuid(),
  series_id   int         unique not null,
  title_ko    text        not null,
  title_en    text        default '',
  title_id    text        default '',
  desc_ko     text        not null,
  desc_en     text        default '',
  desc_id     text        default '',
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists product_series_sort_idx on product_series (sort_order, series_id);

-- ── PRODUCT ITEMS (시리즈 하위 상품) ──────────────────────
create table if not exists product_items (
  id           uuid primary key default gen_random_uuid(),
  series_id    uuid not null references product_series(id) on delete cascade,
  image        text not null,
  detail_img   text default '',
  name_ko      text not null,
  name_en      text default '',
  name_id      text default '',
  tags_ko      jsonb default '[]'::jsonb,
  tags_en      jsonb default '[]'::jsonb,
  tags_id      jsonb default '[]'::jsonb,
  desc_ko      text not null,
  desc_en      text default '',
  desc_id      text default '',
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists product_items_series_idx on product_items (series_id, sort_order);

-- ── updated_at 자동 갱신 트리거 ─────────────────────────
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_journal_updated_at on journal;
create trigger trg_journal_updated_at        before update on journal        for each row execute function set_updated_at();

drop trigger if exists trg_product_series_updated_at on product_series;
create trigger trg_product_series_updated_at before update on product_series for each row execute function set_updated_at();

drop trigger if exists trg_product_items_updated_at on product_items;
create trigger trg_product_items_updated_at  before update on product_items  for each row execute function set_updated_at();

-- ══════════════════════════════════════════════════════════
-- RLS (Row Level Security)
--   - 모든 사람: SELECT 가능 (public site가 데이터 표시)
--   - 로그인한 사용자만: INSERT/UPDATE/DELETE (admin only)
-- ══════════════════════════════════════════════════════════
alter table journal        enable row level security;
alter table product_series enable row level security;
alter table product_items  enable row level security;

-- public SELECT
drop policy if exists "public read journal"        on journal;
create policy "public read journal"        on journal        for select using (true);
drop policy if exists "public read product_series" on product_series;
create policy "public read product_series" on product_series for select using (true);
drop policy if exists "public read product_items"  on product_items;
create policy "public read product_items"  on product_items  for select using (true);

-- authenticated write
drop policy if exists "auth write journal"        on journal;
create policy "auth write journal"        on journal        for all to authenticated using (true) with check (true);
drop policy if exists "auth write product_series" on product_series;
create policy "auth write product_series" on product_series for all to authenticated using (true) with check (true);
drop policy if exists "auth write product_items"  on product_items;
create policy "auth write product_items"  on product_items  for all to authenticated using (true) with check (true);
