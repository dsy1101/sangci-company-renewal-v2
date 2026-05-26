-- ══════════════════════════════════════════════════════════
-- Seed: detail-modal content for the 4 Mandheling items.
-- Run in SQL Editor AFTER 007_product_detail_img2.sql.
-- Idempotent (re-runnable).
--
-- Also renames the series + items from "만데링" → "만델링" to match
-- the spec the user is standardizing on.
--
-- Photo columns (image / detail_img / detail_img2) are NOT touched —
-- the admin already uploaded all three photo slots per item.
-- ══════════════════════════════════════════════════════════

-- ── Rename the series (만데링 → 만델링) ────────────────────
update product_series
  set title_ko = '아라비카 만델링 시리즈'
  where series_id = 2;

-- ── 1) Mandheling Jasmine ─────────────────────────────────
update product_items
set
  name_ko        = '아라비카 만델링 자스민',
  subtitle_ko    = '만다일링 숲에 내린 자스민 비',
  subtitle_en    = 'Jasmine Rain over Mandheling Forest',
  detail_desc_ko = $desc$깊고 묵직한 바디감으로 이름 높은 만다일링(Mandheling) 커피에 혁신적인 인퓨즈드 프로세스(Infused Process)를 더했습니다. 전통적인 커피의 무게감 위에 우아한 자스민 티의 향이 마치 안개처럼 내려앉아, 커피를 마시는 내내 고급스러운 꽃차를 마시는 듯한 착각을 불러일으킵니다. 익숙한 만델링의 편안함 속에서 발견하는 낯선 화사함이 돋보이는 제품입니다.$desc$,
  region         = 'Indonesia (Mandheling, Sumatra)',
  process        = 'Infused Process',
  taste_notes_ko = '자스민 티',
  taste_notes_en = 'Jasmine Tea',
  fragrance_ko   = '자스민 티',
  fragrance_en   = 'Jasmine Tea',
  grade          = 'Mix 15-18',
  moisture       = '13% - 14%',
  body           = 4
where name_ko in ('아라비카 만데링 자스민', '아라비카 만델링 자스민');

-- ── 2) Mandheling Peach ───────────────────────────────────
update product_items
set
  name_ko        = '아라비카 만델링 피치',
  subtitle_ko    = '한 입 가득 베어 문 복숭아의 설렘',
  subtitle_en    = 'Burst of Sweet Peach Juicy',
  detail_desc_ko = $desc$수마트라 산지의 풍부한 오일감을 가진 원두에 정교한 인퓨즈드 프로세스(Infused Process)를 적용하여 복숭아의 향긋함을 극대화했습니다. 첫 모금에서 느껴지는 잘 익은 복숭아의 달콤한 과즙 향은 만델링 특유의 부드러운 질감과 만나 입안에서 기분 좋게 굴러갑니다. 커피의 쌉쌀함보다는 과일의 향긋한 여운이 길게 남는, 감각적인 경험을 선사합니다.$desc$,
  region         = 'Indonesia (Mandheling, Sumatra)',
  process        = 'Infused Process',
  taste_notes_ko = '피치',
  taste_notes_en = 'Peach',
  fragrance_ko   = '피치',
  fragrance_en   = 'Peach',
  grade          = 'Mix 15-18',
  moisture       = '13% - 14%',
  body           = 4
where name_ko in ('아라비카 만데링 피치', '아라비카 만델링 피치');

-- ── 3) Mandheling Coconut ─────────────────────────────────
update product_items
set
  name_ko        = '아라비카 만델링 코코넛',
  subtitle_ko    = '해발 1400m 고지대의 트로피컬 휴식',
  subtitle_en    = 'Tropical Relaxation at 1,400m Altitude',
  detail_desc_ko = $desc$구름과 맞닿은 해발 1400m 고지대의 단단한 원두만을 선별했습니다. 높은 고도에서 자라 밀도가 높은 이 원두에 인퓨즈드 프로세스(Infused Process)를 통해 코코넛의 크리미한 풍미를 입혀, 한 잔의 커피에서 열대 휴양지의 여유를 느끼게 합니다. 풍부한 바디감과 코코넛의 고소함은 비할 데 없는 만족감을 제공합니다.$desc$,
  region         = 'Indonesia (Mandheling, Sumatra)',
  process        = 'Infused Process',
  taste_notes_ko = '코코넛',
  taste_notes_en = 'Coconut',
  fragrance_ko   = '코코넛',
  fragrance_en   = 'Coconut',
  grade          = 'Mix 15-18',
  moisture       = '13% - 14%',
  body           = 4
where name_ko in ('아라비카 만데링 코코넛', '아라비카 만델링 코코넛');

-- ── 4) Mandheling Strawberry ──────────────────────────────
update product_items
set
  name_ko        = '아라비카 만델링 스트로베리',
  subtitle_ko    = '향미의 혁명, 인퓨즈드 프로세스',
  subtitle_en    = 'Flavor Revolution, Infused Process',
  detail_desc_ko = $desc$전통적인 만델링 산지에서 피어난 가장 현대적인 향미의 정수입니다. 독창적인 인퓨즈드 프로세스(Infused Process)를 통해 상큼하고 선명한 딸기 캐릭터를 생두에 각인시켰습니다. 마치 딸기 캔디를 입에 머금은 듯 폭발적인 아로마는 기존 커피의 틀을 깨뜨리며, 바이어와 로스터에게 영감을 주는 강력한 시그니처가 될 것입니다.$desc$,
  region         = 'Indonesia (Mandheling, Sumatra)',
  process        = 'Infused Process',
  taste_notes_ko = '스트로베리',
  taste_notes_en = 'Strawberry',
  fragrance_ko   = '스트로베리',
  fragrance_en   = 'Strawberry',
  grade          = 'Mix 15-18',
  moisture       = '13% - 14%',
  body           = 4
where name_ko in ('아라비카 만데링 스트로베리', '아라비카 만델링 스트로베리');

-- ── Verify ──────────────────────────────────────────────────
-- select name_ko, subtitle_ko, region, process, body
--   from product_items
--   where name_ko like '아라비카 만델링%'
--   order by sort_order;
