/* ==========================================================================
   SLEEPCRAFT 3D — ZHETISUMATRAS OFFICIAL APP CONTROLLER
   ========================================================================== */

import { Mattress3DStudio } from './mattress3d.js';

// Material Database Dictionary
const MATERIALS = {
  'pocket-spring': {
    name: 'Pocket Spring 500',
    thickness: 17,
    pricePerCmSqM: 1200,
    stiffness: 6,
    load: 140,
    color: '#94a3b8'
  },
  'coconut': {
    name: 'Кокосовая Койра',
    thickness: 2,
    pricePerCmSqM: 2500,
    stiffness: 9,
    load: 140,
    color: '#78350f'
  },
  'latex': {
    name: 'Натуральный Латекс',
    thickness: 3,
    pricePerCmSqM: 3200,
    stiffness: 4,
    load: 130,
    color: '#eab308'
  },
  'foam': {
    name: 'Ортопедическая Пена HR',
    thickness: 3,
    pricePerCmSqM: 1100,
    stiffness: 6,
    load: 120,
    color: '#2563eb'
  },
  'memory': {
    name: 'Memory Foam (Память)',
    thickness: 3,
    pricePerCmSqM: 2800,
    stiffness: 3,
    load: 120,
    color: '#9333ea'
  },
  'felt': {
    name: 'Термовойлок',
    thickness: 0.5,
    pricePerCmSqM: 800,
    stiffness: 7,
    load: 130,
    color: '#64748b'
  }
};

// Official ZHETISUMATRAS Catalogue Models & Price Table
const CATALOGUE_MODELS = [
  {
    id: 'komfort-1',
    name: 'КОМФОРТ 1',
    category: 'medium',
    badge: 'Классический • Оптимальный',
    badgeClass: 'medium',
    image: 'assets/komfort-1-render.jpg',
    desc: 'Классический пружинный матрас на блоке Pocket Spring (17 см) с защитным термовойлоком и комфортной ортопедической пеной.',
    layers: [
      { matId: 'foam', thickness: 2 },
      { matId: 'felt', thickness: 0.5 },
      { matId: 'pocket-spring', thickness: 17 },
      { matId: 'felt', thickness: 0.5 },
      { matId: 'foam', thickness: 2 }
    ],
    cover: 'cotton',
    prices: {
      80: 44000,
      90: 47000,
      120: 55000,
      140: 69000,
      160: 73000,
      180: 81000,
      200: 91000
    }
  },
  {
    id: 'komfort-lite',
    name: 'КОМФОРТ ЛАЙТ',
    category: 'springless',
    badge: 'Беспружинный • Койра + Пена',
    badgeClass: 'firm',
    image: 'assets/komfort-lite-render.jpg',
    desc: 'Беспружинный монолитный матрас повышенной плотности из ортопедической пены HR с натуральной кокосовой койрой.',
    layers: [
      { matId: 'coconut', thickness: 2 },
      { matId: 'foam', thickness: 16 }
    ],
    cover: 'cotton',
    prices: {
      80: 46000,
      90: 49000,
      120: 58000,
      140: 74000,
      160: 77000,
      180: 85000,
      200: 95000
    }
  },
  {
    id: 'komfort-3',
    name: 'КОМФОРТ 3',
    category: 'medium',
    badge: 'Усиленный • Койра + Пена',
    badgeClass: 'medium',
    image: 'assets/komfort-3-user.jpg',
    desc: 'Усиленный пружинный матрас с двусторонними слоями натуральной кокосовой койры и ортопедической пены на блоке Pocket Spring 17 см.',
    layers: [
      { matId: 'foam', thickness: 2 },
      { matId: 'coconut', thickness: 1 },
      { matId: 'felt', thickness: 0.5 },
      { matId: 'pocket-spring', thickness: 17 },
      { matId: 'felt', thickness: 0.5 },
      { matId: 'coconut', thickness: 1 },
      { matId: 'foam', thickness: 2 }
    ],
    cover: 'cotton',
    prices: {
      80: 55000,
      90: 58000,
      120: 77000,
      140: 95000,
      160: 99000,
      180: 107000,
      200: 117000
    }
  },
  {
    id: 'komfort-4',
    name: 'КОМФОРТ 4',
    category: 'firm',
    badge: 'Разносторонний (Жесткий/Мягкий)',
    badgeClass: 'medium',
    image: 'assets/komfort-4-render.jpg',
    desc: 'Двусторонний матрас с разной жесткостью сторон на независимом блоке Pocket Spring 17 см.',
    layers: [
      { matId: 'coconut', thickness: 2 },
      { matId: 'felt', thickness: 0.5 },
      { matId: 'pocket-spring', thickness: 17 },
      { matId: 'felt', thickness: 0.5 },
      { matId: 'foam', thickness: 3 }
    ],
    cover: 'cotton',
    prices: {
      80: 50000,
      90: 53000,
      120: 64000,
      140: 83000,
      160: 85000,
      180: 93000,
      200: 104000
    }
  },
  {
    id: 'komfort-cocos',
    name: 'КОМФОРТ КОКОС',
    category: 'firm',
    badge: 'Экстра-Жесткий • Black Cover',
    badgeClass: 'firm',
    image: 'assets/komfort-cocos-user.jpg',
    desc: 'Высокожесткий ортопедический матрас с мощным слоем кокоса на независимых пружинах 17 см в черном стеганом чехле.',
    layers: [
      { matId: 'coconut', thickness: 3 },
      { matId: 'felt', thickness: 0.5 },
      { matId: 'pocket-spring', thickness: 17 },
      { matId: 'felt', thickness: 0.5 },
      { matId: 'coconut', thickness: 3 }
    ],
    cover: 'black',
    prices: {
      80: 57000,
      90: 59000,
      120: 74000,
      140: 93000,
      160: 97000,
      180: 105000,
      200: 118000
    }
  },
  {
    id: 'premium-luxe',
    name: 'ПРЕМИУМ ЛЮКС',
    category: 'soft',
    badge: 'Премиум • Натуральный Латекс',
    badgeClass: 'soft',
    image: 'assets/premium-luxe-user.jpg',
    desc: 'Флагманский матрас повышенного комфорта с блоком Pocket Spring 17 см, натуральным бельгийским латексом и кокосом.',
    layers: [
      { matId: 'latex', thickness: 3 },
      { matId: 'coconut', thickness: 2 },
      { matId: 'felt', thickness: 0.5 },
      { matId: 'pocket-spring', thickness: 17 },
      { matId: 'felt', thickness: 0.5 },
      { matId: 'coconut', thickness: 2 }
    ],
    cover: 'cashmere',
    prices: {
      80: 72000,
      90: 76000,
      120: 94000,
      140: 120000,
      160: 131000,
      180: 144000,
      200: 160000
    }
  }
];

class MattressApp {
  constructor() {
    this.widthCm = 160;
    this.lengthCm = 200;
    this.currentModelId = 'komfort-3';
    this.layers = [
      { id: 1, matId: 'foam', name: 'Ортопедическая Пена HR', thickness: 2 },
      { id: 2, matId: 'coconut', name: 'Кокосовая Койра', thickness: 1 },
      { id: 3, matId: 'felt', name: 'Термовойлок', thickness: 0.5 },
      { id: 4, matId: 'pocket-spring', name: 'Pocket Spring 500', thickness: 17 },
      { id: 5, matId: 'felt', name: 'Термовойлок', thickness: 0.5 },
      { id: 6, matId: 'coconut', name: 'Кокосовая Койра', thickness: 1 },
      { id: 7, matId: 'foam', name: 'Ортопедическая Пена HR', thickness: 2 }
    ];
    this.coverType = 'cotton';
    this.explodeFactor = 0;
    this.cutawayEnabled = false;
    this.coverEnabled = true;
    this.cartCount = 0;

    this.initUI();
    this.initBannerSlider();
    this.init3DStudio();
    this.renderCatalogue();
    this.updateCalculations();
  }

  initUI() {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPaneId = btn.getAttribute('data-tab');
        this.switchTab(targetPaneId);
      });
    });

    const presetChips = document.querySelectorAll('.preset-chip');
    presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        presetChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        this.widthCm = parseInt(chip.getAttribute('data-w'));
        this.lengthCm = parseInt(chip.getAttribute('data-l'));

        document.getElementById('customSizeCheck').checked = false;
        document.getElementById('customSizeControls').classList.add('hidden');

        this.onModelUpdate();
      });
    });

    const customCheck = document.getElementById('customSizeCheck');
    const customControls = document.getElementById('customSizeControls');
    const rangeW = document.getElementById('rangeWidth');
    const rangeL = document.getElementById('rangeLength');

    customCheck.addEventListener('change', () => {
      if (customCheck.checked) {
        customControls.classList.remove('hidden');
        presetChips.forEach(c => c.classList.remove('active'));
      } else {
        customControls.classList.add('hidden');
      }
    });

    rangeW.addEventListener('input', (e) => {
      this.widthCm = parseInt(e.target.value);
      document.getElementById('valWidth').textContent = this.widthCm;
      this.onModelUpdate();
    });

    rangeL.addEventListener('input', (e) => {
      this.lengthCm = parseInt(e.target.value);
      document.getElementById('valLength').textContent = this.lengthCm;
      this.onModelUpdate();
    });

    document.querySelectorAll('.add-mat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const matCard = btn.closest('.mat-card');
        const matId = matCard.getAttribute('data-mat');
        const thick = parseFloat(btn.getAttribute('data-thick')) || MATERIALS[matId].thickness;

        this.currentModelId = null;
        this.addLayer(matId, thick);
      });
    });

    document.querySelectorAll('.cat-header').forEach(header => {
      header.addEventListener('click', () => {
        header.closest('.mat-category').classList.toggle('open');
      });
    });

    document.getElementById('clearLayersBtn').addEventListener('click', () => {
      this.layers = [];
      this.currentModelId = null;
      this.renderLayersStack();
      this.onModelUpdate();
      this.showToast('Слои матраса очищены');
    });

    document.querySelectorAll('.cover-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.cover-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        this.coverType = opt.getAttribute('data-cover');
        this.onModelUpdate();
      });
    });

    document.getElementById('explodeSlider').addEventListener('input', (e) => {
      this.explodeFactor = parseFloat(e.target.value);
      document.getElementById('explodeValueText').textContent = Math.round(this.explodeFactor * 100) + '%';
      this.onModelUpdate();
    });

    document.getElementById('btnResetView').addEventListener('click', () => {
      if (this.studio3d) this.studio3d.resetCameraView();
    });

    document.getElementById('btnTopView').addEventListener('click', () => {
      if (this.studio3d) this.studio3d.topCameraView();
    });

    document.getElementById('btnCutawayToggle').addEventListener('click', () => {
      this.cutawayEnabled = !this.cutawayEnabled;
      const btn = document.getElementById('btnCutawayToggle');
      btn.classList.toggle('active', this.cutawayEnabled);
      this.onModelUpdate();
    });

    document.getElementById('btnCoverToggle').addEventListener('click', () => {
      this.coverEnabled = !this.coverEnabled;
      const btn = document.getElementById('btnCoverToggle');
      btn.classList.toggle('active', this.coverEnabled);
      document.getElementById('coverLabel').textContent = this.coverEnabled ? 'Чехол ВКЛ' : 'Чехол ВЫКЛ';
      this.onModelUpdate();
    });

    document.getElementById('openCartBtn').addEventListener('click', () => this.openCheckoutModal());
    document.getElementById('statCheckoutBtn').addEventListener('click', () => this.openCheckoutModal());
    document.getElementById('closeCheckoutModal').addEventListener('click', () => this.closeCheckoutModal());
    
    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleOrderSubmit();
    });
  }

  initBannerSlider() {
    const track = document.getElementById('sliderTrack');
    const wrapper = document.getElementById('bannerSliderWrapper');
    const prevBtn = document.getElementById('slidePrevBtn');
    const nextBtn = document.getElementById('slideNextBtn');
    const dots = document.querySelectorAll('#sliderDots .dot');

    if (!track || !wrapper) return;

    let currentIndex = 0;
    const totalSlides = 3;
    let autoSlideTimer = null;

    const updateSlider = (index) => {
      currentIndex = (index + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const nextSlide = () => updateSlider(currentIndex + 1);
    const prevSlide = () => updateSlider(currentIndex - 1);

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'));
        updateSlider(idx);
      });
    });

    // Touch Swipe Gesture Support for Smartphones
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    wrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      clearInterval(autoSlideTimer);
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    wrapper.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const diffX = startX - currentX;
      if (Math.abs(diffX) > 40 && currentX !== 0) {
        if (diffX > 0) nextSlide();
        else prevSlide();
      }
      startX = 0; currentX = 0;
      startAutoSlide();
    });

    // Auto-slide timer every 4.5 seconds
    const startAutoSlide = () => {
      clearInterval(autoSlideTimer);
      autoSlideTimer = setInterval(nextSlide, 4500);
    };

    wrapper.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
    wrapper.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();
  }

  init3DStudio() {
    const container = document.getElementById('canvasContainer');
    const loader = document.getElementById('canvasLoader');

    try {
      this.studio3d = new Mattress3DStudio(container);
    } catch (err) {
      console.error('3D Studio Initialization:', err);
    } finally {
      setTimeout(() => {
        if (loader) loader.classList.add('hidden');
      }, 500);
    }

    this.onModelUpdate();
    this.renderLayersStack();
  }

  switchTab(tabId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });

    const targetPane = document.getElementById(`pane-${tabId}`);
    if (targetPane) targetPane.classList.add('active');
  }

  addLayer(matId, thickness) {
    const matInfo = MATERIALS[matId];
    const newLayer = {
      id: Date.now(),
      matId: matId,
      name: matInfo.name,
      thickness: thickness
    };

    this.layers.push(newLayer);
    this.renderLayersStack();
    this.onModelUpdate();
    this.showToast(`Добавлен слой: ${matInfo.name} (${thickness} см)`);
  }

  removeLayer(id) {
    this.layers = this.layers.filter(l => l.id !== id);
    this.currentModelId = null;
    this.renderLayersStack();
    this.onModelUpdate();
  }

  moveLayer(id, direction) {
    const idx = this.layers.findIndex(l => l.id === id);
    if (idx < 0) return;

    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= this.layers.length) return;

    const temp = this.layers[idx];
    this.layers[idx] = this.layers[newIdx];
    this.layers[newIdx] = temp;

    this.currentModelId = null;
    this.renderLayersStack();
    this.onModelUpdate();
  }

  renderLayersStack() {
    const container = document.getElementById('layersStackContainer');
    container.innerHTML = '';

    if (this.layers.length === 0) {
      container.innerHTML = '<div class="hint-text text-center">Каркас матраса пуст. Добавьте наполнители выше.</div>';
      return;
    }

    this.layers.forEach((layer) => {
      const matInfo = MATERIALS[layer.matId];
      const itemEl = document.createElement('div');
      itemEl.className = 'layer-item-card';
      itemEl.style.setProperty('--layer-color', matInfo.color);

      itemEl.innerHTML = `
        <div class="layer-item-info">
          <span class="layer-item-title">${layer.name}</span>
          <span class="layer-item-thick">${layer.thickness} см</span>
        </div>
        <div class="layer-actions">
          <button class="action-icon-btn move-up-btn" title="Сдвинуть вверх"><i data-lucide="chevron-up"></i></button>
          <button class="action-icon-btn move-down-btn" title="Сдвинуть вниз"><i data-lucide="chevron-down"></i></button>
          <button class="action-icon-btn delete-btn" title="Удалить слой"><i data-lucide="x"></i></button>
        </div>
      `;

      itemEl.querySelector('.move-up-btn').addEventListener('click', () => this.moveLayer(layer.id, 1));
      itemEl.querySelector('.move-down-btn').addEventListener('click', () => this.moveLayer(layer.id, -1));
      itemEl.querySelector('.delete-btn').addEventListener('click', () => this.removeLayer(layer.id));

      container.appendChild(itemEl);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  onModelUpdate() {
    if (this.studio3d) {
      this.studio3d.updateMattress(
        this.widthCm,
        this.lengthCm,
        this.layers,
        this.coverType,
        this.explodeFactor,
        this.cutawayEnabled,
        this.coverEnabled
      );
    }

    this.updateCalculations();
  }

  updateCalculations() {
    let totalHeightCm = 0;
    this.layers.forEach(l => { totalHeightCm += l.thickness; });

    document.getElementById('statHeight').textContent = `${totalHeightCm} см`;
    document.getElementById('statDimensions').textContent = `${this.widthCm} × ${this.lengthCm} см`;

    let totalCost = 0;

    const matchedModel = CATALOGUE_MODELS.find(m => m.id === this.currentModelId);
    if (matchedModel && matchedModel.prices[this.widthCm]) {
      totalCost = matchedModel.prices[this.widthCm];
    } else {
      const areaSqM = (this.widthCm * this.lengthCm) / 10000;
      let layersCost = 0;

      this.layers.forEach(l => {
        const matInfo = MATERIALS[l.matId];
        layersCost += (l.thickness * matInfo.pricePerCmSqM * areaSqM);
      });

      const coverCostBase = this.coverType === 'cashmere' ? 35000 : (this.coverType === 'black' ? 30000 : 20000);
      totalCost = Math.round(layersCost + (coverCostBase * areaSqM));
    }

    const formattedPrice = totalCost.toLocaleString('ru-RU') + ' ₸';
    document.getElementById('statPrice').textContent = formattedPrice;
    document.getElementById('navTotalPrice').textContent = formattedPrice;

    let totalStiffnessWeight = 0;
    let maxLoad = 110;

    if (this.layers.length > 0) {
      this.layers.forEach((l, idx) => {
        const matInfo = MATERIALS[l.matId];
        const surfaceWeight = (idx + 1) / this.layers.length;
        totalStiffnessWeight += matInfo.stiffness * surfaceWeight;
        if (matInfo.load > maxLoad) maxLoad = matInfo.load;
      });

      const avgStiffness = Math.round((totalStiffnessWeight / this.layers.length) * 1.2);
      const clampedStiffness = Math.min(Math.max(avgStiffness, 1), 10);

      let firmnessLabel = 'Средний';
      if (clampedStiffness <= 3) firmnessLabel = 'Мягкий';
      else if (clampedStiffness <= 4) firmnessLabel = 'Умеренно-мягкий';
      else if (clampedStiffness <= 6) firmnessLabel = 'Средний';
      else if (clampedStiffness <= 8) firmnessLabel = 'Умеренно-жесткий';
      else firmnessLabel = 'Экстра-жесткий';

      document.getElementById('statFirmness').textContent = `${firmnessLabel} (${clampedStiffness}/10)`;
      document.getElementById('firmnessMeterBar').style.width = `${clampedStiffness * 10}%`;
    } else {
      document.getElementById('statFirmness').textContent = '—';
      document.getElementById('firmnessMeterBar').style.width = '0%';
    }

    document.getElementById('statMaxLoad').textContent = `${maxLoad} кг / место`;
  }

  renderCatalogue() {
    const grid = document.getElementById('catalogGrid');
    grid.innerHTML = '';

    const sizesList = [80, 90, 120, 140, 160, 180, 200];

    CATALOGUE_MODELS.forEach(model => {
      let activeCardWidth = 160;

      const card = document.createElement('div');
      card.className = 'catalog-card glass-card';

      let layersListHtml = '';
      model.layers.forEach(l => {
        const matInfo = MATERIALS[l.matId];
        layersListHtml += `
          <div class="mini-layer">
            <span class="mini-dot" style="background:${matInfo.color}"></span>
            <span>${matInfo.name} (${l.thickness} см)</span>
          </div>
        `;
      });

      let sizeChipsHtml = '';
      sizesList.forEach(s => {
        const activeClass = s === activeCardWidth ? 'active' : '';
        sizeChipsHtml += `<button class="card-size-chip ${activeClass}" data-size="${s}">${s}×200</button>`;
      });

      card.innerHTML = `
        <div>
          <div class="cat-card-media" style="background-image: url('${model.image}'); background-size: cover; background-position: center; height: 200px; border-radius: 12px; margin-bottom: 1rem; position: relative;">
            <span class="cat-badge ${model.badgeClass}" style="position: absolute; top: 12px; right: 12px;">${model.badge}</span>
          </div>
          <div class="cat-card-header">
            <div class="cat-card-title">
              <h3>${model.name}</h3>
            </div>
          </div>
          <p class="hint-text">${model.desc}</p>

          <div class="cat-size-selector">
            <span class="size-label">Выберите размер:</span>
            <div class="card-size-chips">
              ${sizeChipsHtml}
            </div>
          </div>

          <div class="cat-layers-mini">
            ${layersListHtml}
          </div>
        </div>

        <div class="cat-card-footer">
          <div class="price-cat-box">
            <span class="price-cat-label">Цена (<span class="selected-size-val">${activeCardWidth}×200</span>):</span>
            <span class="cat-price">${model.prices[activeCardWidth].toLocaleString('ru-RU')} ₸</span>
          </div>
          <button class="primary-btn load-cat-btn">
            <i data-lucide="box"></i> Открыть в 3D (<span class="btn-size-val">${activeCardWidth}×200</span>)
          </button>
        </div>
      `;

      card.querySelectorAll('.card-size-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          const selectedW = parseInt(chip.getAttribute('data-size'));
          activeCardWidth = selectedW;

          card.querySelectorAll('.card-size-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');

          const newPrice = model.prices[selectedW].toLocaleString('ru-RU') + ' ₸';
          card.querySelector('.cat-price').textContent = newPrice;
          card.querySelector('.selected-size-val').textContent = `${selectedW}×200`;
          card.querySelector('.btn-size-val').textContent = `${selectedW}×200`;
        });
      });

      card.querySelector('.load-cat-btn').addEventListener('click', () => {
        this.loadCatalogModelToConstructor(model, activeCardWidth);
      });

      grid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  loadCatalogModelToConstructor(model, selectedWidth = 160) {
    this.currentModelId = model.id;
    this.widthCm = selectedWidth;
    this.lengthCm = 200;

    document.querySelectorAll('.preset-chip').forEach(chip => {
      const chipW = parseInt(chip.getAttribute('data-w'));
      chip.classList.toggle('active', chipW === selectedWidth);
    });

    this.layers = model.layers.map((l, idx) => ({
      id: Date.now() + idx,
      matId: l.matId,
      name: MATERIALS[l.matId].name,
      thickness: l.thickness
    }));

    this.coverType = model.cover;
    this.switchTab('constructor');
    this.renderLayersStack();
    this.onModelUpdate();
    this.showToast(`Модель "${model.name}" (${selectedWidth}×200 см) загружена в 3D Конструктор!`);
  }

  openCheckoutModal() {
    if (this.layers.length === 0) {
      this.showToast('Добавьте хотя бы один слой в конструкторе!');
      return;
    }

    let totalHeightCm = 0;
    this.layers.forEach(l => { totalHeightCm += l.thickness; });

    document.getElementById('modalSizeBadge').textContent = 
      `${this.widthCm} × ${this.lengthCm} см • Высота ${totalHeightCm} см`;

    const layersListEl = document.getElementById('modalLayersList');
    layersListEl.innerHTML = '';
    this.layers.forEach(l => {
      const li = document.createElement('li');
      li.textContent = `${l.name} — ${l.thickness} см`;
      layersListEl.appendChild(li);
    });

    document.getElementById('modalFirmness').textContent = document.getElementById('statFirmness').textContent;
    document.getElementById('modalCoverName').textContent = this.coverType.toUpperCase();
    document.getElementById('modalTotalPrice').textContent = document.getElementById('statPrice').textContent;

    document.getElementById('checkoutModal').classList.add('open');
  }

  closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('open');
  }

  handleOrderSubmit() {
    this.closeCheckoutModal();

    if (window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    this.cartCount++;
    document.getElementById('cartBadgeCount').textContent = this.cartCount;

    this.showToast('🎉 Ваш заказ матраса принят! Менеджер Zhetisu Matras свяжется с вами в течение 10 минут.');
  }

  showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="check-circle"></i> <span>${message}</span>`;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

function initApp() {
  if (!window.app) {
    window.app = new MattressApp();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
