-- ══════════════════════════════════════════════════════════
-- Fix: 009 didn't match the rows for Arabica Kerinci / Robusta
-- Temanggung because the actual name_ko in DB was already renamed
-- to "끄린치" / "뜨망궁" via the admin, while 009's WHERE clause only
-- accepted "케린치" / "테망궁" or "끄린찌". This re-runs the same
-- updates using LIKE so any spelling variant matches.
-- Idempotent — safe to run repeatedly.
-- ══════════════════════════════════════════════════════════

-- ── 1) Arabica Kerinci Natural ────────────────────────────
update product_items
set
  name_ko        = '아라비카 끄린찌 내추럴',
  subtitle_ko    = '화산이 선물한 다채로운 과즙미',
  subtitle_en    = 'The Volcanic Juicy Brightness',
  detail_desc_ko = $desc$수마트라섬의 지붕이자 거대한 활화산인 끄린찌 산(Mt. Kerinci) 기슭, 영양분이 풍부한 검은 화산재 토양에서 자라났습니다. 인도네시아의 뜨거운 햇살 아래 체리 상태 그대로 건조되는 내추럴 가공을 거치며 원두는 화산 토양 특유의 강렬한 생명력을 품게 됩니다. 시트러스의 산뜻함으로 시작해 딸기와 망고의 진한 달콤함으로 마무리되는 이 커피는 끄린찌 산의 거친 자연 속에 숨겨진 화려한 반전 매력을 보여줍니다.$desc$,
  region         = 'Indonesia (Mt. Kerinci, Sumatra)',
  process        = 'Natural',
  taste_notes_ko = '시트러스, 스트로베리, 피치, 망고',
  taste_notes_en = 'Citrus, Strawberry, Peach, Mango',
  fragrance_ko   = '프루티, 프레시 플로럴',
  fragrance_en   = 'Fruity, Fresh Floral',
  grade          = 'Mix 15-18',
  moisture       = '13% - 14%',
  body           = 4
where name_en = 'Arabica Kerinci Natural';

-- ── 2) Robusta Temanggung Washed ──────────────────────────
update product_items
set
  name_ko        = '로부스타 뜨망궁 워시드',
  subtitle_ko    = '자바섬의 정수가 담긴 프리미엄 로부스타',
  subtitle_en    = 'Premium Robusta from the Heart of Java',
  detail_desc_ko = $desc$인도네시아 최고의 로부스타 명산지 중 하나인 자바섬 뜨망궁(Temanggung) 지역에서 생산된 프리미엄 생두입니다. 깨끗하고 정교한 워시드(Washed) 공법을 적용하여 로부스타 고유의 구수함과 묵직함은 고스란히 살리면서도, 잡미 없이 세련된 마무리를 자랑합니다. 에스프레소 블렌딩의 완성도를 높이고자 하는 글로벌 바이어 및 로스터들에게 최고의 솔루션을 제공합니다.$desc$,
  region         = 'Indonesia (Temanggung, Java)',
  process        = 'Washed',
  taste_notes_ko = '',
  taste_notes_en = '',
  fragrance_ko   = '',
  fragrance_en   = '',
  grade          = 'Mix 15-18',
  moisture       = '13% - 14%',
  body           = 0
where name_en = 'Robusta Temanggung Washed';

-- ── Verify ──────────────────────────────────────────────────
-- select name_ko, name_en, subtitle_ko, region
--   from product_items
--   where name_en in ('Arabica Kerinci Natural', 'Robusta Temanggung Washed');
