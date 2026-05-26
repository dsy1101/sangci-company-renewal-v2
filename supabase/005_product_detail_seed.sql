-- ══════════════════════════════════════════════════════════
-- Seed: detail-modal content for all 9 product items.
-- Run AFTER 004_schema_additions.sql.
-- Idempotent — every block is a single UPDATE, safe to re-run.
--
-- Notes:
--   - image / detail_img / detail_img2 (photo URLs) are NOT touched.
--     Admins manage those via the "사진 1/2/3" pickers in the product
--     edit form. Modal photos for the Aceh Gayo series are relative
--     paths (assets/products-detail/*.png) seeded once and left alone.
--   - Matching is done on name_en (the English name is stable across
--     Korean spelling adjustments admins might make later).
--   - "Body" is a 0-5 dot rating. Empty fields hide automatically in
--     the modal spec table (used here for Robusta's TBC values).
-- ══════════════════════════════════════════════════════════


-- ══════════════════════════════════════════════════════════
-- SERIES 1 — Arabica Aceh Gayo  (3 items)
-- Photo files live under assets/products-detail/ in this repo.
-- ══════════════════════════════════════════════════════════

-- 1.1 Arabica Aceh Gayo Natural
update product_items
set
  detail_img     = 'assets/products-detail/아라비카_아체가요_내추럴_3.png',
  detail_img2    = 'assets/products-detail/아라비카_아체가요_내추럴_2.png',
  subtitle_ko    = '가요 고원의 깊은 밤, 베리의 풍미',
  subtitle_en    = 'Deep Night of Gayo Highland, Berry Profile',
  detail_desc_ko = $desc$안개 낀 아체 가요(Aceh Gayo) 고원의 서늘한 기후는 커피 체리가 천천히 익어가며 당도를 축적하게 만듭니다. 수확된 체리를 자연 건조하는 동안 농익은 과일의 풍미가 씨앗 깊숙이 스며들어, 블랙베리의 진한 풍미와 화사한 꽃향기가 어우러진 우아한 결과물을 만들어냅니다. 입안 가득 느껴지는 강렬한 바디감은 가요 지역 테루아의 묵직한 힘을 증명합니다.$desc$,
  region         = 'Indonesia (Aceh Gayo, Sumatra)',
  process        = 'Natural',
  taste_notes_ko = '블랙베리, 플로럴',
  taste_notes_en = 'Blackberry, Floral',
  fragrance_ko   = '프루티, 플로럴',
  fragrance_en   = 'Fruity, Floral',
  grade          = 'Mix 15-18',
  moisture       = '13% - 14%',
  body           = 5
where name_en = 'Arabica Aceh Gayo Natural';

-- 1.2 Arabica Aceh Gayo Full-washed
update product_items
set
  detail_img     = 'assets/products-detail/아라비카_아체가요_풀워시드_3.png',
  detail_img2    = 'assets/products-detail/아라비카_아체가요_풀워시드_2.png',
  subtitle_ko    = '유서 깊은 S 795 품종의 깨끗한 유산',
  subtitle_en    = 'The Clean Heritage of Historic S 795',
  detail_desc_ko = $desc$인도네시아 커피 역사에서 중요한 위치를 차지하는 S 795 품종만을 선별하여 정교한 풀 워시드 공법으로 가공했습니다. 가요 고원의 깨끗한 물로 과육을 말끔히 씻어내어, 품종 본연의 잠재력을 투명하게 드러냈습니다. 초콜릿의 달콤한 베이스 위에 프루티한 산미와 견과류의 고소함이 정교하게 설계된 듯한 밸런스를 이루며, 가장 현대적이고 세련된 가요 커피의 단면을 보여줍니다.$desc$,
  region         = 'Indonesia (Aceh Gayo, Sumatra)',
  process        = 'Full Washed',
  taste_notes_ko = '플로럴, 프루티, 초콜릿',
  taste_notes_en = 'Floral, Fruity, Chocolate',
  fragrance_ko   = '프레시 너티',
  fragrance_en   = 'Fresh Nutty',
  grade          = 'Mix 15-18',
  moisture       = '13% - 14%',
  body           = 5
where name_en = 'Arabica Aceh Gayo Full-washed';

-- 1.3 Arabica Aceh Gayo Semi-washed
update product_items
set
  detail_img     = 'assets/products-detail/아라비카_아체가요_세미워시드_3.png',
  detail_img2    = 'assets/products-detail/아라비카_아체가요_세미워시드_2.png',
  subtitle_ko    = '인도네시아의 영혼, 길링 바사',
  subtitle_en    = 'The Soul of Indonesia, Wet Hulling',
  detail_desc_ko = $desc$인도네시아에서만 만날 수 있는 전통 가공 방식인 '길링 바사(Wet Hulling)'를 통해 탄생한 정통 커피입니다. 생두의 수분이 채 마르기 전 탈곡하는 이 독특한 과정은 스파이시한 아로마와 묵직한 흙 내음이라는 독보적인 캐릭터를 완성합니다. 시트러스의 산미와 브라운 슈가의 진한 단맛이 교차하는 이 커피는 수백 년간 이어져 온 인도네시아 커피의 거칠고도 매혹적인 영혼을 담고 있습니다.$desc$,
  region         = 'Indonesia (Aceh Gayo, Sumatra)',
  process        = 'Semi-Washed (Giling Basah)',
  taste_notes_ko = '스파이시, 시트러스, 브라운 슈가',
  taste_notes_en = 'Spices, Citrus, Brown Sugar',
  fragrance_ko   = '스파이시, 어시',
  fragrance_en   = 'Spicy, Earthy',
  grade          = 'Mix 15-18',
  moisture       = '13% - 14%',
  body           = 5
where name_en = 'Arabica Aceh Gayo Semi-washed';


-- ══════════════════════════════════════════════════════════
-- SERIES 2 — Mandheling  (4 items, Infused Process)
-- Photos uploaded by admin (image/detail_img/detail_img2 all set
-- via the Storage picker).
-- ══════════════════════════════════════════════════════════

-- Series title rename: 만데링 → 만델링
update product_series set title_ko = '아라비카 만델링 시리즈' where series_id = 2;

-- 2.1 Mandheling Jasmine
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
where name_en = 'Arabica Mandheling Jasmine';

-- 2.2 Mandheling Peach
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
where name_en = 'Arabica Mandheling Peach';

-- 2.3 Mandheling Coconut
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
where name_en = 'Arabica Mandheling Coconut';

-- 2.4 Mandheling Strawberry
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
where name_en = 'Arabica Mandheling Strawberry';


-- ══════════════════════════════════════════════════════════
-- SERIES 3 — Kerinci Arabica + Temanggung Robusta  (2 items)
-- ══════════════════════════════════════════════════════════

-- 3.1 Arabica Kerinci Natural
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

-- 3.2 Robusta Temanggung Washed  (taste/fragrance/body TBC → empty)
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


-- ── Verify (optional) ──────────────────────────────────────
-- select series_id, name_en, subtitle_ko, region, process, body
--   from product_items
--   order by series_id, sort_order;
