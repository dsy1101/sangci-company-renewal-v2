    // ══════════════════════════════════════════════
    // LANG ENGINENGINE
    // ══════════════════════════════════════════════
    let currentLang = 'ko';
    function setLang(lang) {
      currentLang = lang;
      document.body.classList.remove('lang-en', 'lang-id', 'lang-ko');
      document.body.classList.add('lang-' + lang);
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.lang-btn')[{ ko: 0, en: 1, id: 2 }[lang]].classList.add('active');
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        if (T[lang][k] !== undefined) el.innerHTML = T[lang][k];
      });
      document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const k = el.getAttribute('data-i18n-ph');
        if (T[lang][k] !== undefined) el.setAttribute('placeholder', T[lang][k]);
      });
      renderCategories();
      renderCatalog();
      renderVlog('all');
    }

    // ══════════════════════════════════════════════
    // SELLER CATEGORIES
    // ══════════════════════════════════════════════
    function renderCategories() {
      const container = document.getElementById('seller-cat-grid');
      if (!container) return;

      container.className = 'seller-series-container';

      container.innerHTML = catData.map((series, sIdx) => {
        const title = series.title[currentLang] || series.title.en;
        const desc = series.desc[currentLang] || series.desc.en;
        const num = String(sIdx + 1).padStart(2, '0');

        const cardsHtml = series.items.map((item, iIdx) => {
          const name = item.name[currentLang] || item.name.en;
          const tags = item.tags[currentLang] || item.tags.en;
          const itemDesc = item.desc[currentLang] || item.desc.en;
          const safeName = name.replace(/'/g, "\\'");
          const safeType = T[currentLang].seller_opt || 'Seller';

          // Whole card click → detail modal. Footer click → inquire (stops bubbling).
          const imageHtml = `<div class="card-image-wrap"><img src="${item.image}" alt="${name}" loading="lazy"></div>`;
          const contentHtml = `<div class="card-content-wrap">
            <div class="card-coffee-title">${name}</div>
            <div class="card-coffee-tags">
              ${tags.map(t => `<span class="card-coffee-tag">${t}</span>`).join('')}
            </div>
            <p class="card-coffee-desc">${itemDesc}</p>
            <div class="card-coffee-footer" onclick="event.stopPropagation(); inquireCategory('${safeName}','${safeType}')">
              <span>${T[currentLang].inquire_msg_label || 'Inquire'}</span> <span>→</span>
            </div>
          </div>`;

          return `<div class="series-card fade-in-element" style="cursor:pointer;" onclick="openItemModal(${sIdx}, ${iIdx})">
            ${imageHtml}
            ${contentHtml}
          </div>`;
        }).join('');

        return `<div class="series-section fade-in-element">
          <div class="series-header">
            <div class="series-num-title">
              <span class="series-num">${num}</span>
              <h3 class="series-title">${title}</h3>
            </div>
            <p class="series-desc">${desc}</p>
          </div>
          <div class="series-grid" style="grid-template-columns: repeat(${series.items.length}, 1fr);">
            ${cardsHtml}
          </div>
        </div>`;
      }).join('');

      initScrollReveal();
    }

    function initScrollReveal() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
      });

      document.querySelectorAll('.fade-in-element').forEach(el => {
        observer.observe(el);
      });
    }

    function inquireCategory(catName, roleLabel) {
      showPage('home');
      setTimeout(() => {
        scrollToContact(); setTimeout(() => {
          const msg = document.getElementById('f-msg');
          const role = document.getElementById('f-role');
          if (msg) msg.value = T[currentLang].inquire_msg(catName, roleLabel);
          if (role) role.value = roleLabel;
        }, 600);
      }, 300);
    }


    let catalogLayout = 'grid';
    let catalogFilters = {
      search: '',
      country: 'all',
      yield: 'all',
      mucilage: 'all',
      beansize: 'all',
      rust: 'all',
      disease: 'all'
    };

    function setCatalogLayout(layout) {
      catalogLayout = layout;
      document.getElementById('view-grid').classList.toggle('active', layout === 'grid');
      document.getElementById('view-list').classList.toggle('active', layout === 'list');

      const gridEl = document.getElementById('catalog-products-grid');
      if (gridEl) {
        gridEl.classList.toggle('list-view', layout === 'list');
      }
      renderCatalog();
    }

    function setBeanFilter(filterKey, value) {
      catalogFilters[filterKey] = value;

      const scaleId = filterKey === 'mucilage' ? 'scale-mucilage' : 'scale-beansize';
      const container = document.getElementById(scaleId);
      if (container) {
        container.querySelectorAll('.bean-option').forEach(el => {
          el.classList.toggle('active', el.getAttribute('data-value') === value);
        });
      }
      renderCatalog();
    }

    function setRustFilter(value) {
      catalogFilters.rust = value;
      const container = document.getElementById('rust-filters');
      if (container) {
        container.querySelectorAll('.badge-btn').forEach(el => {
          el.classList.toggle('active', el.getAttribute('data-value') === value);
        });
      }
      renderCatalog();
    }

    function setDiseaseFilter(value) {
      catalogFilters.disease = value;
      const container = document.getElementById('disease-filters');
      if (container) {
        container.querySelectorAll('.badge-btn').forEach(el => {
          el.classList.toggle('active', el.getAttribute('data-value') === value);
        });
      }
      renderCatalog();
    }

    function onCatalogFilterChange() {
      catalogFilters.search = document.getElementById('catalog-search').value.toLowerCase();
      catalogFilters.country = document.getElementById('filter-country').value;
      catalogFilters.yield = document.getElementById('filter-yield').value;
      renderCatalog();
    }

    function resetAllCatalogFilters() {
      catalogFilters = {
        search: '',
        country: 'all',
        yield: 'all',
        mucilage: 'all',
        beansize: 'all',
        rust: 'all',
        disease: 'all'
      };

      document.getElementById('catalog-search').value = '';
      document.getElementById('filter-country').value = 'all';
      document.getElementById('filter-yield').value = 'all';

      document.querySelectorAll('.bean-scale').forEach(container => {
        container.querySelectorAll('.bean-option').forEach(el => {
          el.classList.toggle('active', el.getAttribute('data-value') === 'all');
        });
      });

      document.querySelectorAll('.badge-filters').forEach(container => {
        container.querySelectorAll('.badge-btn').forEach(el => {
          el.classList.toggle('active', el.getAttribute('data-value') === 'all');
        });
      });

      renderCatalog();
    }

    function toggleMobileSidebar() {
      const sidebar = document.getElementById('catalog-sidebar-el');
      if (sidebar) sidebar.classList.toggle('open');
    }

    function renderCatalog() {
      const grid = document.getElementById('catalog-products-grid');
      const countEl = document.getElementById('catalog-result-count');
      if (!grid) return;

      const filtered = coffeeClones.filter(clone => {
        if (catalogFilters.search) {
          const matchName = clone.name.toLowerCase().includes(catalogFilters.search);
          const matchDesc = clone.desc[currentLang].toLowerCase().includes(catalogFilters.search) || clone.desc.en.toLowerCase().includes(catalogFilters.search);
          if (!matchName && !matchDesc) return false;
        }
        if (catalogFilters.country !== 'all' && clone.country !== catalogFilters.country) return false;
        if (catalogFilters.yield !== 'all' && clone.yield !== catalogFilters.yield) return false;
        if (catalogFilters.mucilage !== 'all' && clone.mucilage !== catalogFilters.mucilage) return false;
        if (catalogFilters.beansize !== 'all' && clone.beansize !== catalogFilters.beansize) return false;
        if (catalogFilters.rust !== 'all' && clone.rust !== catalogFilters.rust) return false;
        if (catalogFilters.disease !== 'all' && clone.disease !== catalogFilters.disease) return false;
        return true;
      });

      if (countEl) countEl.innerText = filtered.length;

      if (filtered.length === 0) {
        const noResultsMsg = {
          en: 'No cultivars match your filters.',
          id: 'Tidak ada kultivar yang cocok dengan filter Anda.',
          ko: '선택하신 필터 조건에 부합하는 커피 품종이 없습니다.'
        }[currentLang];
        grid.innerHTML = `<div class="catalog-empty"><div class="catalog-empty-icon">🌱</div>${noResultsMsg}</div>`;
        return;
      }

      grid.innerHTML = filtered.map(clone => {
        const desc = clone.desc[currentLang] || clone.desc.en;
        const originLabel = clone.country === 'Brazil' ? (currentLang === 'ko' ? '브라질' : clone.country) : (currentLang === 'ko' ? '인도네시아' : clone.country);
        const yieldLabel = currentLang === 'ko' ? '수확량: ' + (clone.yield === 'Very High' ? '매우 높음' : '높음') : 'Yield: ' + clone.yield;
        const sizeLabel = currentLang === 'ko' ? '생두: ' + (clone.beansize === 'Large' ? '대형' : clone.beansize === 'Medium' ? '중형' : '소형') : 'Size: ' + clone.beansize;
        const rustLabel = currentLang === 'ko' ? '녹병: ' + (clone.rust === 'Resistant' ? '저항성' : clone.rust === 'Tolerant' ? '내성' : '감수성') : 'Rust: ' + clone.rust;

        return `
          <div class="clone-card" onclick="openCatalogModal('${clone.id}')">
            <div class="clone-img-wrap">
              <img src="${clone.img}" alt="${clone.name}" class="clone-img" loading="lazy">
              <span class="clone-origin-badge">${originLabel}</span>
            </div>
            <div class="clone-card-body">
              <h3>${clone.name}</h3>
              <p class="clone-card-desc">${desc}</p>
              <div class="clone-card-specs">
                <span class="clone-card-spec-tag gold">${yieldLabel}</span>
                <span class="clone-card-spec-tag">${sizeLabel}</span>
                <span class="clone-card-spec-tag">${rustLabel}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function openCatalogModal(cloneId) {
      const clone = coffeeClones.find(c => c.id === cloneId);
      if (!clone) return;

      const overlay = document.getElementById('catalog-modal-overlay-el');
      const content = document.getElementById('catalog-modal-content-el');

      const originLabel = clone.country === 'Brazil' ? (currentLang === 'ko' ? '브라질 출시' : clone.country + ' Release') : (currentLang === 'ko' ? '인도네시아 출시' : clone.country + ' Release');
      const yieldVal = currentLang === 'ko' ? (clone.yield === 'Very High' ? '최상 (Very High)' : '상 (High)') : clone.yield;
      const sizeVal = currentLang === 'ko' ? (clone.beansize === 'Large' ? '대형 (Large)' : clone.beansize === 'Medium' ? '중형 (Medium)' : '소형 (Small)') : clone.beansize;
      const mucilageVal = currentLang === 'ko' ? (clone.mucilage === 'High' ? '높음 (High)' : clone.mucilage === 'Medium' ? '보통 (Medium)' : '낮음 (Low)') : clone.mucilage;
      const rustVal = currentLang === 'ko' ? (clone.rust === 'Resistant' ? '강력 저항성 (Resistant)' : clone.rust === 'Tolerant' ? '중간 내성 (Tolerant)' : '감수성 (Susceptible)') : clone.rust;
      const diseaseVal = currentLang === 'ko' ? (clone.disease === 'Resistant' ? '강력 저항성 (Resistant)' : clone.disease === 'Tolerant' ? '중간 내성 (Tolerant)' : '감수성 (Susceptible)') : clone.disease;

      const tableHeaders = {
        yield: currentLang === 'ko' ? '수확 잠재력 (Yield Potential)' : 'Yield Potential',
        beansize: currentLang === 'ko' ? '생두 크기 (Bean Size)' : 'Bean Size',
        mucilage: currentLang === 'ko' ? '점액질 함량 (Mucilage Content)' : 'Mucilage Content',
        rust: currentLang === 'ko' ? '잎녹병 저항성 (Leaf Rust)' : 'Coffee Leaf Rust',
        disease: currentLang === 'ko' ? '탄저병 저항성 (Berry Disease)' : 'Coffee Berry Disease'
      };

      const ctaText = currentLang === 'ko' ? '이 품종 문의하기' : 'Inquire about this Clone';

      content.innerHTML = `
        <div class="catalog-modal-left">
          <img src="${clone.img}" alt="${clone.name}" class="catalog-modal-img">
        </div>
        <div class="catalog-modal-right">
          <div>
            <h2>${clone.name}</h2>
            <span class="catalog-modal-origin">${originLabel}</span>
            <p class="catalog-modal-desc">${clone.desc[currentLang] || clone.desc.en}</p>
            
            <table class="catalog-modal-table">
              <tr>
                <th>${tableHeaders.yield}</th>
                <td>${yieldVal}</td>
              </tr>
              <tr>
                <th>${tableHeaders.beansize}</th>
                <td>${sizeVal}</td>
              </tr>
              <tr>
                <th>${tableHeaders.mucilage}</th>
                <td>${mucilageVal}</td>
              </tr>
              <tr>
                <th>${tableHeaders.rust}</th>
                <td>${rustVal}</td>
              </tr>
              <tr>
                <th>${tableHeaders.disease}</th>
                <td>${diseaseVal}</td>
              </tr>
            </table>
          </div>
          
          <button class="inquire-btn" onclick="inquireCloneDirect('${clone.name}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>${ctaText}</span>
          </button>
        </div>
      `;

      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeCatalogModalDirect() {
      const overlay = document.getElementById('catalog-modal-overlay-el');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    function closeCatalogModal(e) {
      if (e.target.id === 'catalog-modal-overlay-el') {
        closeCatalogModalDirect();
      }
    }

    function inquireCloneDirect(cloneName) {
      closeCatalogModalDirect();
      showPage('home');
      setTimeout(() => {
        scrollToContact();
        setTimeout(() => {
          const msg = document.getElementById('f-msg');
          const role = document.getElementById('f-role');
          if (msg) {
            const inquireMsg = {
              ko: `안녕하세요, 상치컴퍼니 제품 소개 페이지를 보고 연락드립니다. 커피 품종 [${cloneName}]에 대한 상세 공급 계약 조건 및 수입 절차에 대한 상담을 요청합니다.`,
              en: `Hello, I am contacting you after viewing the coffee clone [${cloneName}] in your catalog. Please provide detailed commercial supply terms and import consultation.`,
              id: `Halo, saya menghubungi Anda setelah melihat klon kopi [${cloneName}] di katalog Anda. Mohon berikan informasi detail mengenai persyaratan pasokan komersial dan konsultasi impor.`
            }[currentLang];
            msg.value = inquireMsg;
          }
          if (role) {
            role.value = { ko: '판매자', en: 'Seller', id: 'Penjual' }[currentLang];
          }
        }, 600);
      }, 300);
    }

    // ══════════════════════════════════════════════
    // VLOG RENDERER
    // ══════════════════════════════════════════════
    let activeFilter = 'all';
    function filterVlog(tag) {
      activeFilter = tag;
      document.querySelectorAll('.vfilter').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');
      renderVlog(tag);
    }
    // ── Journal entry helpers ────────────────────────────────
    // Entries use a flat schema: title_ko/en/id, body_ko/en/id.
    // Korean is required; other locales fall back to Korean if empty.
    function vlogField(v, base, lang) {
      const v1 = v[base + '_' + lang];
      if (v1 && String(v1).trim()) return v1;
      return v[base + '_ko'] || '';
    }
    // File-extension sniff. Treat known video extensions as video,
    // everything else as image. Empty URL → 'none' (caller renders fallback).
    function vlogMediaKind(url) {
      if (!url) return 'none';
      const m = String(url).toLowerCase().match(/\.([a-z0-9]+)(?:\?|#|$)/);
      if (!m) return 'image';
      return ['mp4', 'mov', 'webm', 'ogv', 'ogg', 'm4v'].includes(m[1]) ? 'video' : 'image';
    }
    // Instagram-style square card media slot.
    // Video plays muted/looping inline; image gets <img>; empty → big emoji.
    function vlogMediaHtml(v) {
      const url = v.thumbnail_url || '';
      const kind = vlogMediaKind(url);
      if (kind === 'video') {
        return `<video class="vlog-thumb" src="${url}" autoplay muted loop playsinline preload="metadata"></video>
                <div class="vlog-video-badge" aria-hidden="true">▶</div>`;
      }
      if (kind === 'image') {
        return `<img class="vlog-thumb" src="${url}" alt="" loading="lazy">`;
      }
      return `<div class="vlog-thumb-placeholder">${v.emoji || '📝'}</div>`;
    }
    // Markdown body → plain text preview for card summaries.
    function vlogPreview(md, limit) {
      if (!md) return '';
      if (typeof marked !== 'undefined') {
        const tmp = document.createElement('div');
        tmp.innerHTML = marked.parse(md);
        const txt = (tmp.textContent || '').replace(/\s+/g, ' ').trim();
        return txt.length > limit ? txt.slice(0, limit) + '…' : txt;
      }
      const stripped = md.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#*_`>]/g, '').replace(/\s+/g, ' ').trim();
      return stripped.length > limit ? stripped.slice(0, limit) + '…' : stripped;
    }

    function renderVlog(tag) {
      const grid = document.getElementById('vlog-grid');
      if (!grid) return;
      const filtered = tag === 'all' ? vlogs : vlogs.filter(v => v.tag === tag);
      if (filtered.length === 0) {
        grid.innerHTML = `<div class="vlog-empty"><div class="vlog-empty-icon">📭</div>${T[currentLang].vlog_empty || 'No posts yet.'}</div>`;
        return;
      }
      const tagLabels = { meeting: T[currentLang].vlog_meeting, field: T[currentLang].vlog_field, factory: T[currentLang].vlog_factory, travel: T[currentLang].vlog_travel, networking: T[currentLang].vlog_networking };
      grid.innerHTML = filtered.map((v) => {
        const idx = vlogs.indexOf(v);
        const title = vlogField(v, 'title', currentLang);
        const preview = vlogPreview(vlogField(v, 'body', currentLang), 90);
        const tagLabel = tagLabels[v.tag] || v.tag;
        return `<div class="vlog-card" onclick="openModal(${idx})">
      ${vlogMediaHtml(v)}
      <span class="vlog-tag">${tagLabel}</span>
      <div class="vlog-overlay">
        <div class="vlog-date">${v.date}</div>
        <div class="vlog-title">${title}</div>
        <div class="vlog-desc">${preview}</div>
      </div>
    </div>`;
      }).join('');
    }

    function openModal(idx) {
      const v = vlogs[idx];
      const lang = currentLang;
      const title = vlogField(v, 'title', lang);
      const body = vlogField(v, 'body', lang);
      const tagLabels = { meeting: T[lang].vlog_meeting, field: T[lang].vlog_field, factory: T[lang].vlog_factory, travel: T[lang].vlog_travel, networking: T[lang].vlog_networking };

      document.getElementById('modal-tag').textContent = tagLabels[v.tag] || v.tag;
      document.getElementById('modal-date').textContent = v.date;
      document.getElementById('modal-title').textContent = title;

      // Render markdown body (images, links, formatting all inline).
      const descEl = document.getElementById('modal-desc');
      descEl.className = 'vlog-modal-prose';
      if (typeof marked !== 'undefined') {
        descEl.innerHTML = marked.parse(body || '');
      } else {
        descEl.textContent = body || '';
      }

      // Instagram-style header: if the entry has a thumbnail, show it
      // (image or video). No thumbnail → no top block (avoids the empty
      // navy emoji panel that looks wrong in a content view).
      const url = v.thumbnail_url || '';
      const kind = vlogMediaKind(url);
      const mediaEl = document.getElementById('modal-media');
      if (kind === 'video') {
        mediaEl.innerHTML = `<video class="vlog-modal-media" src="${url}" autoplay muted loop playsinline controls></video>`;
      } else if (kind === 'image') {
        mediaEl.innerHTML = `<img class="vlog-modal-media" src="${url}" alt="">`;
      } else {
        mediaEl.innerHTML = '';
      }
      document.getElementById('modal-video').innerHTML = '';

      document.getElementById('vlog-modal').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal(e) { if (e.target === document.getElementById('vlog-modal')) { closeModalBtn(); } }
    function closeModalBtn() {
      document.getElementById('vlog-modal').classList.remove('open');
      document.body.style.overflow = '';
      document.getElementById('modal-video').innerHTML = '';
    }

    // ══════════════════════════════════════════════
    // NAVIGATION
    // ══════════════════════════════════════════════
    function showPage(name) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById('page-' + name).classList.add('active');
      window.scrollTo(0, 0);
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      const el = document.getElementById('nav-' + name);
      if (el) el.classList.add('active');
      if (name === 'seller') renderCatalog();
      if (name === 'vlog') renderVlog(activeFilter);
      if (name === 'home') renderHomeVlog();
    }
    function renderHomeVlog() {
      const grid = document.getElementById('home-vlog-grid');
      if (!grid) return;
      const recent = vlogs.slice(0, 3);
      const tagLabels = { meeting: T[currentLang].vlog_meeting, field: T[currentLang].vlog_field, factory: T[currentLang].vlog_factory, travel: T[currentLang].vlog_travel, networking: T[currentLang].vlog_networking };
      grid.innerHTML = recent.map((v) => {
        const idx = vlogs.indexOf(v);
        const title = vlogField(v, 'title', currentLang);
        const preview = vlogPreview(vlogField(v, 'body', currentLang), 90);
        const tagLabel = tagLabels[v.tag] || v.tag;
        return `<div class="vlog-card" onclick="openModal(${idx})">
      ${vlogMediaHtml(v)}
      <span class="vlog-tag">${tagLabel}</span>
      <div class="vlog-overlay">
        <div class="vlog-date">${v.date}</div>
        <div class="vlog-title">${title}</div>
        <div class="vlog-desc">${preview}</div>
      </div>
    </div>`;
      }).join('');
    }
    // Mobile hamburger nav — toggles the .nav-links list overlay open/closed.
    function toggleMobileNav() {
      const links = document.getElementById('nav-links');
      const btn = document.getElementById('nav-hamburger');
      const open = !links.classList.contains('open');
      links.classList.toggle('open', open);
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    function closeMobileNav() {
      const links = document.getElementById('nav-links');
      const btn = document.getElementById('nav-hamburger');
      if (!links || !links.classList.contains('open')) return;
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function scrollToAbout() { showPage('home'); setTimeout(() => { document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' }); }, 100); }
    function scrollToContact() { showPage('home'); setTimeout(() => { document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' }); }, 100); }
    function submitForm() {
      const name = document.getElementById('f-name').value.trim();
      const email = document.getElementById('f-email').value.trim();
      const alerts = { en: 'Please enter your name and email.', id: 'Masukkan nama dan email Anda.', ko: '이름과 이메일을 입력해 주세요.' };
      if (!name || !email) { alert(alerts[currentLang]); return; }
      document.getElementById('the-form').style.display = 'none';
      document.getElementById('success-msg').style.display = 'block';
    }

    // Init — load JSON data first, then render. See js/data.js for loadData().
    (async () => {
      try {
        await loadData();
      } catch (err) {
        console.error('Failed to load site data:', err);
      }
      setLang('ko');
      renderCategories();
      renderCatalog();
      renderVlog('all');
      renderHomeVlog();
    })();
    // Product Detail Modal logic
    function openProductDetail(src) {
      document.getElementById('product-detail-img').src = src;
      document.getElementById('product-detail-modal').classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeProductDetail() {
      document.getElementById('product-detail-modal').classList.remove('active');
      // Only re-enable body scroll if no underlying modal is still open
      // (e.g. the product detail modal often opens the lightbox on top
      // of itself; closing the lightbox should leave body scroll locked).
      const itemOpen = document.getElementById('item-modal')?.classList.contains('open');
      const vlogOpen = document.getElementById('vlog-modal')?.classList.contains('open');
      if (!itemOpen && !vlogOpen) document.body.style.overflow = '';
      document.getElementById('product-detail-img').src = '';
    }

    // ══════════════════════════════════════════════
    // PRODUCT ITEM DETAIL MODAL  (rich detail page in modal form)
    // ══════════════════════════════════════════════
    // Pick a localized field; fall back to KO, then EN, then ''.
    function itemLocale(obj, lang) {
      if (!obj) return '';
      return obj[lang] || obj.ko || obj.en || '';
    }
    // Build the "Body" intensity row as filled/empty dots (●●●○○).
    function bodyDots(n) {
      const v = Math.max(0, Math.min(5, parseInt(n, 10) || 0));
      return '<span class="item-body-dots">'
        + '●'.repeat(v) + '<span class="item-body-dots-off">' + '○'.repeat(5 - v) + '</span>'
        + '</span>';
    }
    function openItemModal(seriesIdx, itemIdx) {
      const series = catData[seriesIdx];
      if (!series) return;
      const item = series.items[itemIdx];
      if (!item) return;
      const lang = currentLang;

      const name      = itemLocale(item.name, lang);
      const subtitle  = itemLocale(item.subtitle, lang);
      const detail    = itemLocale(item.detailDesc, lang);
      const shortDesc = itemLocale(item.desc, lang);
      const tasteNote = itemLocale(item.tasteNotes, lang);
      const fragrance = itemLocale(item.fragrance, lang);

      // Single vertical column. Like a long-form product post:
      //   header (title + subtitle)
      //   photo 1 (full width, large)
      //   body text
      //   photo 2 (full width, large)
      //   spec table
      //   CTA
      const specLabels = lang === 'ko'
        ? { region: '원산지 / Region', process: '가공방식 / Process', taste: '컵노트 / Taste Notes', fragrance: '향미 / Fragrance', grade: '생두 등급 / Grade', moisture: '수분율 / Moisture', body: '바디 / Body' }
        : { region: 'Region', process: 'Process', taste: 'Taste Notes', fragrance: 'Fragrance', grade: 'Grade', moisture: 'Moisture', body: 'Body' };

      const rows = [
        ['region',    item.region,    specLabels.region],
        ['process',   item.process,   specLabels.process],
        ['taste',     tasteNote,      specLabels.taste],
        ['fragrance', fragrance,      specLabels.fragrance],
        ['grade',     item.grade,     specLabels.grade],
        ['moisture',  item.moisture,  specLabels.moisture],
      ].filter(([, v]) => v && String(v).trim());
      const bodyRow = (item.body > 0) ? `<tr><th>${specLabels.body}</th><td>${bodyDots(item.body)}</td></tr>` : '';
      const specTable = (rows.length || bodyRow)
        ? `<table class="item-modal-spec">${rows.map(([, v, label]) => `<tr><th>${label}</th><td>${v}</td></tr>`).join('')}${bodyRow}</table>`
        : '';

      const ctaText = lang === 'ko' ? '이 제품 문의하기' : (lang === 'id' ? 'Tanyakan produk ini' : 'Inquire about this product');
      const safeName = name.replace(/'/g, "\\'");
      const safeType = T[lang].seller_opt || 'Seller';

      // Photos: side-by-side row when both are present, single full-width
      // when only one is present.
      const photoCount = (item.detailImg ? 1 : 0) + (item.detailImg2 ? 1 : 0);
      const photoTag = (src) =>
        `<img class="item-modal-photo" src="${src}" alt="${name}" onclick="openProductDetail('${src}')">`;
      const photosHtml = photoCount === 0 ? '' : `
        <div class="item-modal-photos${photoCount === 1 ? ' single' : ''}">
          ${item.detailImg  ? photoTag(item.detailImg)  : ''}
          ${item.detailImg2 ? photoTag(item.detailImg2) : ''}
        </div>`;

      document.getElementById('item-modal-body').innerHTML = `
        <header class="item-modal-header">
          <h2 class="item-modal-title">${name}</h2>
          ${subtitle ? `<div class="item-modal-subtitle">${subtitle}</div>` : ''}
        </header>
        ${photosHtml}
        ${detail ? `<div class="item-modal-desc">${detail.replace(/\n/g, '<br>')}</div>` : (shortDesc ? `<div class="item-modal-desc">${shortDesc}</div>` : '')}
        ${specTable}
        <button class="item-modal-cta" onclick="closeItemModalDirect(); inquireCategory('${safeName}','${safeType}')">
          <span>${ctaText}</span> <span>→</span>
        </button>
      `;
      const overlay = document.getElementById('item-modal');
      overlay.classList.add('open');
      const inner = overlay.querySelector('.item-modal');
      if (inner) inner.scrollTop = 0;
      document.body.style.overflow = 'hidden';
    }
    function closeItemModalDirect() {
      const m = document.getElementById('item-modal');
      if (m) m.classList.remove('open');
      document.body.style.overflow = '';
    }
    function closeItemModal(e) {
      if (e.target.id === 'item-modal') closeItemModalDirect();
    }

