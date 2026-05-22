    // ══════════════════════════════════════════════════════════
    // ✏️  JOURNAL POSTS — ADD / EDIT / REMOVE ENTRIES HERE
    //
    //  Fields:
    //   date    : display date string  e.g. "May 6, 2026"
    //   tag     : one of: meeting | field | factory | travel | networking
    //   title   : post title (shown on card and in modal)
    //   desc    : longer description shown in modal
    //   img     : URL of a thumbnail image, or "" to show emoji placeholder
    //   emoji   : fallback emoji when no img is set
    //   youtube : YouTube embed URL e.g. "https://www.youtube.com/embed/VIDEO_ID"
    //             or "" if no video yet
    //
    //  HOW TO ADD: Copy one block below, paste at the TOP (newest first),
    //              fill in your details, save the file.
    //  HOW TO REMOVE: Delete the entire { ... }, block.
    // ══════════════════════════════════════════════════════════
    const vlogs = [
      {
        date: "May 8, 2026",
        tag: "meeting",
        title: { en: "Strategy meeting in Busan", id: "Rapat strategi di Busan", ko: "부산 전략 회의" },
        desc: {
          en: "Our team gathered in Busan to align on Q2 market entry plans for Indonesian partners. We discussed regulatory timelines, key contacts, and next steps for three active deals.",
          id: "Tim kami berkumpul di Busan untuk menyesuaikan rencana masuk pasar Q2 bagi mitra Indonesia. Kami mendiskusikan jadwal regulasi, kontak utama, dan langkah selanjutnya untuk tiga kesepakatan aktif.",
          ko: "저희 팀은 인도네시아 파트너의 2분기 시장 진출 계획을 조율하기 위해 부산에 모였습니다. 규제 일정, 주요 연락처 및 3개의 진행 중인 거래에 대한 다음 단계를 논의했습니다."
        },
        img: "",
        emoji: "🤝",
        youtube: ""
      },
      {
        date: "May 3, 2026",
        tag: "factory",
        title: { en: "Factory visit — Nickel processing plant, Sulawesi", id: "Kunjungan pabrik — Pabrik pengolahan nikel, Sulawesi", ko: "공장 방문 — 술라웨시 니켈 가공 공장" },
        desc: {
          en: "We visited a leading nickel processing facility in Sulawesi to assess production capacity and quality standards. A potential supply agreement is under discussion with Korean battery manufacturers.",
          id: "Kami mengunjungi fasilitas pengolahan nikel terkemuka di Sulawesi untuk menilai kapasitas produksi dan standar kualitas. Perjanjian pasokan potensial sedang dibahas dengan produsen baterai Korea.",
          ko: "생산 능력과 품질 기준을 평가하기 위해 술라웨시에 있는 선도적인 니켈 가공 시설을 방문했습니다. 한국 배터리 제조업체와 잠재적인 공급 계약을 논의 중입니다."
        },
        img: "",
        emoji: "🏭",
        youtube: ""
      },
      {
        date: "Apr 28, 2026",
        tag: "travel",
        title: { en: "Business trip to Jakarta — partner onboarding", id: "Perjalanan bisnis ke Jakarta — orientasi mitra", ko: "자카르타 출장 — 파트너 온보딩" },
        desc: {
          en: "Christian flew to Jakarta to meet three new potential partners in the food & beverage and textile sectors. Productive meetings and site visits were held over two days.",
          id: "Christian terbang ke Jakarta untuk bertemu tiga mitra potensial baru di sektor makanan & minuman dan tekstil. Pertemuan produktif dan kunjungan lapangan diadakan selama dua hari.",
          ko: "크리스티안은 식음료 및 섬유 분야의 세 곳의 새로운 잠재 파트너를 만나기 위해 자카르타로 비행했습니다. 이틀 동안 생산적인 회의와 현장 방문이 진행되었습니다."
        },
        img: "",
        emoji: "✈️",
        youtube: ""
      },
      {
        date: "Apr 20, 2026",
        tag: "field",
        title: { en: "Field check — Palm oil plantation, Kalimantan", id: "Pemeriksaan lapangan — Perkebunan kelapa sawit, Kalimantan", ko: "현장 점검 — 칼리만탄 팜유 농장" },
        desc: {
          en: "We conducted a field inspection of a palm oil plantation in Kalimantan on behalf of a Korean food company. We checked sustainability certifications, logistics access, and output volumes.",
          id: "Kami melakukan inspeksi lapangan perkebunan kelapa sawit di Kalimantan atas nama perusahaan makanan Korea. Kami memeriksa sertifikasi keberlanjutan, akses logistik, dan volume produksi.",
          ko: "한국 식품 회사를 대신하여 칼리만탄의 팜유 농장을 현장 점검했습니다. 지속 가능성 인증, 물류 접근성 및 생산량을 확인했습니다."
        },
        img: "",
        emoji: "🌴",
        youtube: ""
      },
      {
        date: "Apr 15, 2026",
        tag: "networking",
        title: { en: "Korea–Indonesia Trade Forum, Seoul", id: "Forum Perdagangan Korea–Indonesia, Seoul", ko: "한-인니 무역 포럼, 서울" },
        desc: {
          en: "Sangci Company participated in the Korea–Indonesia Trade Forum hosted in Seoul. We connected with government trade officials, logistics partners, and B2B companies exploring bilateral opportunities.",
          id: "Sangci Company berpartisipasi dalam Forum Perdagangan Korea–Indonesia yang diadakan di Seoul. Kami terhubung dengan pejabat perdagangan pemerintah, mitra logistik, dan perusahaan B2B yang mengeksplorasi peluang bilateral.",
          ko: "상치컴퍼니는 서울에서 열린 한-인니 무역 포럼에 참가했습니다. 정부 무역 관계자, 물류 파트너, 그리고 양국 간의 기회를 모색하는 B2B 기업들과 네트워크를 형성했습니다."
        },
        img: "",
        emoji: "🤝",
        youtube: ""
      }
    ];


    const catData = [
      {
        id: 1,
        title: { en: "Arabica Aceh Gayo Series", id: "Seri Arabica Aceh Gayo", ko: "아라비카 아체 가요 시리즈" },
        desc: {
          en: "Curated specialty Arabica coffees sourced directly from the volcanic highlands of Central Aceh, Indonesia.",
          id: "Kopi Arabika specialty yang dikurasi langsung dari dataran tinggi vulkanik Aceh Tengah, Indonesia.",
          ko: "인도네시아 아체 가요 고원지대의 비옥한 화산재 토양에서 자라 깊은 바디감과 복합적인 아로마를 자랑하는 시그니처 아라비카 라인업"
        },
        items: [
          {
            image: "assets/gayo_plantation.png",
            detailImg: "assets/gayo_natural_detail.jpeg",
            name: { en: "Arabica Aceh Gayo Natural", id: "Arabica Aceh Gayo Natural", ko: "아라비카 아체 가요 내추럴" },
            tags: {
              en: ["Central Aceh", "Natural Process", "Blackberry", "Floral", "Strong Body"],
              id: ["Aceh Tengah", "Proses Natural", "Blackberry", "Floral", "Body Tebal"],
              ko: ["아체 센트럴", "내추럴 프로세스", "블랙베리", "플로럴", "스트롱 바디"]
            },
            desc: {
              en: "Premium Arabica from Central Aceh with a complex berry profile and heavy body.",
              id: "Arabika premium dari Aceh Tengah dengan rasa beri kompleks dan body tebal.",
              ko: "복합적인 베리 향미와 묵직한 바디감을 가진 아체 센트럴 지역의 프리미엄 아라비카."
            }
          },
          {
            image: "assets/roasted_beans.png",
            name: { en: "Arabica Aceh Gayo Full-washed", id: "Arabica Aceh Gayo Full-washed", ko: "아라비카 아체 가요 풀워시드" },
            tags: {
              en: ["Central Aceh", "Full-washed Process", "Floral", "Fruity", "Chocolate", "Strong Body"],
              id: ["Aceh Tengah", "Proses Full-washed", "Floral", "Fruity", "Cokelat", "Body Tebal"],
              ko: ["아체 센트럴", "풀워시드 프로세스", "플로럴", "프루티", "초콜릿", "스트롱 바디"]
            },
            desc: {
              en: "Clean, bright floral notes balanced with sweet chocolate undertones.",
              id: "Rasa floral yang bersih dan cerah dipadukan dengan sentuhan cokelat manis.",
              ko: "화사한 꽃향기와 달콤한 초콜릿 피니시가 균형 잡힌 깔끔한 커피."
            }
          },
          {
            image: "assets/specialty_pour_over.png",
            name: { en: "Arabica Aceh Gayo Semi-washed", id: "Arabica Aceh Gayo Semi-washed", ko: "아라비카 아체 가요 세미워시드" },
            tags: {
              en: ["Central Aceh", "Semi-washed Process", "Herbal", "Spicy", "Clean Finish"],
              id: ["Aceh Tengah", "Proses Semi-washed", "Herbal", "Rempah", "Akhir yang Bersih"],
              ko: ["아체 센트럴", "세미워시드 프로세스", "허브", "스파이시", "클린 피니시"]
            },
            desc: {
              en: "Traditional Indonesian wet-hulled cup offering rich herbal spices and a clean finish.",
              id: "Kopi giling basah tradisional dengan rempah herbal melimpah dan akhir bersih.",
              ko: "풍부한 허브 스파이스와 깔끔한 끝맛을 자랑하는 전통 인도네시아 세미워시드 커피."
            }
          }
        ]
      },
      {
        id: 2,
        title: { en: "Arabica Mandheling Series", id: "Seri Arabica Mandheling", ko: "아라비카 만데링 시리즈" },
        desc: {
          en: "World-renowned Sumatran coffees featuring exotic infused aromatics and rich, deep cup characteristics.",
          id: "Kopi Sumatra yang terkenal di dunia menampilkan aromatik infus eksotis dan karakteristik rasa yang kaya dan mendalam.",
          ko: "이색적인 천연 가향 공법을 결합하여 독보적인 아로마와 부드러운 바디감을 구현한 전 세계가 사랑하는 만데링 시리즈"
        },
        items: [
          {
            image: "assets/specialty_pour_over.png",
            name: { en: "Arabica Mandheling Jasmine", id: "Arabica Mandheling Jasmine", ko: "아라비카 만데링 자스민" },
            tags: {
              en: ["North Sumatra", "Infused Process", "Jasmine Tea", "Floral"],
              id: ["Sumatra Utara", "Proses Infused", "Teh Melati", "Floral"],
              ko: ["북수마트라", "인퓨즈드 프로세스", "자스민 티", "플로럴"]
            },
            desc: {
              en: "Premium Mandheling Arabica infused with natural jasmine for an aromatic tea-like finish.",
              id: "Arabika Mandheling pilihan yang diinfusi melati alami untuk rasa seperti teh aromatik.",
              ko: "천연 자스민을 가향하여 은은하고 향긋한 자스민 차의 느낌을 더한 프리미엄 만데링."
            }
          },
          {
            image: "assets/roasted_beans.png",
            name: { en: "Arabica Mandheling Peach", id: "Arabica Mandheling Peach", ko: "아라비카 만데링 피치" },
            tags: {
              en: ["North Sumatra", "Infused Process", "Peach", "Sweetness"],
              id: ["Sumatra Utara", "Proses Infused", "Persik", "Manis"],
              ko: ["북수마트라", "인퓨즈드 프로세스", "복숭아", "단맛"]
            },
            desc: {
              en: "Juicy and sweet peach infusion combined with the smooth body of Mandheling.",
              id: "Infusi persik manis juicy dipadukan dengan body lembut khas Mandheling.",
              ko: "주시하고 달콤한 복숭아 향이 만데링의 부드러운 바디감과 어우러진 조화로운 맛."
            }
          },
          {
            image: "assets/harvest_hands.png",
            name: { en: "Arabica Mandheling Coconut", id: "Arabica Mandheling Coconut", ko: "아라비카 만데링 코코넛" },
            tags: {
              en: ["North Sumatra", "Infused Process", "Coconut", "Creamy"],
              id: ["Sumatra Utara", "Proses Infused", "Kelapa", "Creamy"],
              ko: ["북수마트라", "인퓨즈드 프로세스", "코코넛", "크리미"]
            },
            desc: {
              en: "Unique tropical profile showcasing a creamy coconut aroma and balanced finish.",
              id: "Profil tropis unik dengan aroma kelapa yang creamy dan akhir seimbang.",
              ko: "크리미한 코코넛의 고소함과 이색적인 열대 정취를 느낄 수 있는 독특한 커피."
            }
          },
          {
            image: "assets/gayo_plantation.png",
            name: { en: "Arabica Mandheling Strawberry", id: "Arabica Mandheling Strawberry", ko: "아라비카 만데링 스트로베리" },
            tags: {
              en: ["North Sumatra", "Infused Process", "Strawberry", "Fruity"],
              id: ["Sumatra Utara", "Proses Infused", "Stroberi", "Fruity"],
              ko: ["북수마트라", "인퓨즈드 프로세스", "딸기", "프루티"]
            },
            desc: {
              en: "Sweet strawberry notes that complement Mandheling\'s dark chocolate base.",
              id: "Aroma stroberi manis yang melengkapi dasar cokelat hitam khas Mandheling.",
              ko: "달콤한 딸기 향이 만데링 특유의 다크 초콜릿 마우스필과 환상적인 조화를 이룹니다."
            }
          }
        ]
      },
      {
        id: 3,
        title: { en: "Arabica & Robusta Series", id: "Seri Arabica & Robusta", ko: "아라비카 & 로부스타 시리즈" },
        desc: {
          en: "Vibrant single-origin Arabica from Kerinci region and clean, high-grade bold Robusta from Temanggung, Java.",
          id: "Arabika single-origin yang cerah dari wilayah Kerinci dan Robusta bold bermutu tinggi dari Temanggung, Jawa.",
          ko: "수마트라 케린치 지역의 화사한 싱글 오리진 아라비카와 자바 섬 테망궁 지역의 잡미 없이 깨끗하고 묵직한 프리미엄 로부스타 라인업"
        },
        items: [
          {
            image: "assets/harvest_hands.png",
            name: { en: "Arabica Kerinci Natural", id: "Arabica Kerinci Natural", ko: "아라비카 케린치 내추럴" },
            tags: {
              en: ["Kerinci, Sumatra", "Natural Process", "Citrus", "Strawberry", "Peach", "Mango"],
              id: ["Kerinci, Sumatra", "Proses Natural", "Sitrus", "Stroberi", "Persik", "Mangga"],
              ko: ["수마트라 케린치", "내추럴 프로세스", "시트러스", "딸기", "복숭아", "망고"]
            },
            desc: {
              en: "Vibrant, sweet natural coffee bursting with tropical peach and mango flavors.",
              id: "Kopi natural yang manis dan cerah dengan rasa persik tropis dan mangga.",
              ko: "열대 과일(복숭아, 망고)과 시트러스의 상큼하고 달콤한 풍미가 돋보이는 내추럴 커피."
            }
          },
          {
            image: "assets/roasted_beans.png",
            name: { en: "Robusta Temanggung Washed", id: "Robusta Temanggung Washed", ko: "로부스타 테망궁 워시드" },
            tags: {
              en: ["Temanggung, Central Java", "Washed Process", "Nutty", "Bold", "Dark Chocolate"],
              id: ["Temanggung, Jawa Tengah", "Proses Washed", "Nutty", "Bold", "Cokelat Hitam"],
              ko: ["중부 자바 테망궁", "워시드 프로세스", "너티", "볼드", "다크 초콜릿"]
            },
            desc: {
              en: "High-quality robusta offering a bold, clean body with a rich chocolate sweetness.",
              id: "Robusta bermutu tinggi dengan body tebal, rasa nutty, dan kemanisan cokelat pekat.",
              ko: "잡미 없이 깔끔한 고품질 로부스타로, 묵직한 마우스필과 쌉싸름하면서도 달콤한 다크 초콜릿 풍미."
            }
          }
        ]
      }
    ];

    // ══════════════════════════════════════════════
    // PREMIUM COFFEE CULTIVARS CATALOGUE DATA
    // ══════════════════════════════════════════════
    const coffeeClones = [
      {
        id: 'bp534',
        name: 'BP 534',
        country: 'Indonesia',
        yield: 'High',
        mucilage: 'Medium',
        beansize: 'Medium',
        rust: 'Tolerant',
        disease: 'Tolerant',
        desc: {
          en: 'Most commonly grown clone by farmers in Indonesia; suitable for cultivation under agroforestry systems.',
          id: 'Klon yang paling banyak ditanam oleh petani di Indonesia; cocok untuk budidaya di bawah sistem agroforestri.',
          ko: '인도네시아 농가에서 가장 널리 재배되는 품종입니다. 삼림 농업(아그로포레스트리) 시스템 하에서 재배하기에 매우 적합합니다.'
        },
        img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'bp936',
        name: 'BP 936',
        country: 'Indonesia',
        yield: 'High',
        mucilage: 'Low',
        beansize: 'Small',
        rust: 'Susceptible',
        disease: 'Tolerant',
        desc: {
          en: 'Wide adaptability to different environments, with optimal productivity in areas with wet climates; suitable for modern high-yield setups.',
          id: 'Adaptabilitas luas terhadap lingkungan yang berbeda, dengan produktivitas optimal di daerah beriklim basah; cocok untuk pengaturan hasil tinggi modern.',
          ko: '다양한 환경에 대한 뛰어난 적응성을 보이며, 다습한 기후 지역에서 최적의 생산성을 나타냅니다. 현대적인 다수확 재배 환경에 잘 부합합니다.'
        },
        img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'bp939',
        name: 'BP 939',
        country: 'Indonesia',
        yield: 'Very High',
        mucilage: 'High',
        beansize: 'Large',
        rust: 'Tolerant',
        disease: 'Resistant',
        desc: {
          en: 'Wide adaptability to different environments that produces best in areas with dry climates; suitable for cultivation.',
          id: 'Adaptabilitas luas terhadap lingkungan yang berbeda yang menghasilkan terbaik di daerah dengan iklim kering; cocok untuk budidaya.',
          ko: '다양한 재배지 조건에 고루 적응하며 특히 건조한 기후 지역에서 극대화된 생산성을 보입니다. 가뭄에 강한 농업을 계획하는 데 이상적입니다.'
        },
        img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'brs1216',
        name: 'BRS 1216',
        country: 'Brazil',
        yield: 'Very High',
        mucilage: 'Medium',
        beansize: 'Large',
        rust: 'Resistant',
        disease: 'Tolerant',
        desc: {
          en: 'Adaptable to the environments of the Western Amazon with high productivity. Plant structure suitable for mechanized harvesting.',
          id: 'Beradaptasi dengan lingkungan Amazon Barat dengan produktivitas tinggi. Struktur tanaman cocok untuk pemanenan mekanis.',
          ko: '서부 아마존 환경에 뛰어난 생육 적응성과 고도의 생산성을 증명했습니다. 기계 수확에 안성맞춤인 반직립형 수형 구조를 갖추고 있습니다.'
        },
        img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'brs2299',
        name: 'BRS 2299',
        country: 'Brazil',
        yield: 'High',
        mucilage: 'High',
        beansize: 'Medium',
        rust: 'Resistant',
        disease: 'Resistant',
        desc: {
          en: 'Plant structure suitable for mechanized harvesting. Stands out for its tolerance to the root-knot nematode Meloidogyne.',
          id: 'Struktur tanaman cocok untuk pemanenan mekanis. Menonjol karena toleransinya terhadap nematoda puru akar Meloidogyne.',
          ko: '기계 수확에 최적화된 가지 굵기와 형태를 지니고 있으며, 특히 뿌리혹선충(Meloidogyne)에 강력한 내성을 보유하여 토양 오염 대응력이 뛰어납니다.'
        },
        img: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'brs2314',
        name: 'BRS 2314',
        country: 'Brazil',
        yield: 'High',
        mucilage: 'High',
        beansize: 'Large',
        rust: 'Resistant',
        disease: 'Resistant',
        desc: {
          en: 'High cupping scores; has been classified as a \'fine robusta\' with excellent cup quality and aromatic notes.',
          id: 'Skor cupping tinggi; telah diklasifikasikan sebagai \'robusta halus\' dengan kualitas cangkir dan aroma yang sangat baik.',
          ko: '매우 우수한 커핑 스코어를 기록하며 고품격 \'파인 로부스타(Fine Robusta)\' 등급으로 공인받았습니다. 깊은 단맛과 풍부한 아로마가 돋보입니다.'
        },
        img: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'brs2336',
        name: 'BRS 2336',
        country: 'Brazil',
        yield: 'Very High',
        mucilage: 'Medium',
        beansize: 'Large',
        rust: 'Resistant',
        disease: 'Tolerant',
        desc: {
          en: 'Adaptable to the environments of the Western Amazon, with high productivity and bean size. Excellent crop density performance.',
          id: 'Beradaptasi dengan lingkungan Amazon Barat, dengan produktivitas dan ukuran biji yang tinggi. Kinerja kepadatan tanaman yang sangat baik.',
          ko: '서부 아마존 분지 지역의 기후 및 강우 환경에 완벽히 적응하며, 매우 굵은 생두 사이즈와 압도적인 다수확을 실현한 최신 고부가가치 품종입니다.'
        },
        img: 'https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'brs2357',
        name: 'BRS 2357',
        country: 'Brazil',
        yield: 'High',
        mucilage: 'Low',
        beansize: 'Medium',
        rust: 'Resistant',
        disease: 'Tolerant',
        desc: {
          en: 'Compact canopy, which allows for densification. Short stems allow one additional harvest before renewal cycle.',
          id: 'Kanopi kompak, yang memungkinkan untuk pemadatan tanaman. Batang pendek memungkinkan satu panen tambahan sebelum siklus pembaruan.',
          ko: '컴팩트한 수형(Canopy) 덕분에 식재 밀도를 극대화할 수 있어 단위 면적당 수확량이 매우 뛰어납니다. 줄기가 튼튼하고 곧아 관리가 쉽습니다.'
        },
        img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'brs3137',
        name: 'BRS 3137',
        country: 'Brazil',
        yield: 'High',
        mucilage: 'Medium',
        beansize: 'Large',
        rust: 'Resistant',
        disease: 'Resistant',
        desc: {
          en: 'Recognized for its rusticity, presenting good vegetative and productive characteristics in dry conditions and low-fertility soils.',
          id: 'Dikenal karena kerustisitasannya, menyajikan karakteristik vegetatif dan produktif yang baik dalam kondisi kering dan tanah dengan kesuburan rendah.',
          ko: '뛰어난 강인함과 생명력(Rusticity)을 지녀, 영양이 부족한 척박한 토양이나 극심하게 건조한 기후 조건에서도 안정적인 생장과 일정한 결실율을 유지합니다.'
        },
        img: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&q=80&w=600'
      }
    ];
