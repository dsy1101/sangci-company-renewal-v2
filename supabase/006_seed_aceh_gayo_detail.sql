-- ══════════════════════════════════════════════════════════
-- Seed: detail-modal content for the 3 Aceh Gayo items.
-- Run in SQL Editor AFTER 005_product_detail.sql AND 007_product_detail_img2.sql.
-- Idempotent (re-runnable).
--
-- Photo mapping:
--   image       = NOT TOUCHED. The catalog card thumbnail is managed
--                 by the admin ("사진 1" picker → Supabase Storage).
--                 This seed leaves it alone so re-running doesn't
--                 clobber the admin upload.
--   detail_img  = burlap-sack photo (modal main/top, "사진 2").
--   detail_img2 = label-package photo (modal sub/bottom, "사진 3").
-- Files live under assets/products-detail/ in this repo.
-- ══════════════════════════════════════════════════════════

-- 1) Arabica Aceh Gayo Natural
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
where name_ko = '아라비카 아체 가요 내추럴';

-- 2) Arabica Aceh Gayo Full Washed
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
where name_ko = '아라비카 아체 가요 풀워시드';

-- 3) Arabica Aceh Gayo Semi-Washed
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
where name_ko = '아라비카 아체 가요 세미워시드';

-- ── Verify (run separately if you want to check) ───────────
-- select name_ko, image, detail_img, subtitle_ko, region, process, body
--   from product_items
--   where name_ko like '아라비카 아체 가요%'
--   order by sort_order;
