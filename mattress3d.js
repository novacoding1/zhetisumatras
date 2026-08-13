export class Mattress3DStudio {
  constructor(containerElement) {
    const THREE = window.THREE;
    if (!THREE) {
      throw new Error('Three.js library is not loaded');
    }

    this.container = containerElement;
    this.width = containerElement.clientWidth || 300;
    this.height = containerElement.clientHeight || 450;

    // State Variables
    this.explodeFactor = 0;
    this.cutawayEnabled = false;
    this.coverEnabled = true;
    this.currentLayers = [];
    this.widthCm = 160;
    this.lengthCm = 200;
    this.coverType = 'cotton';

    // 3D Objects Cache
    this.layerMeshes = [];
    this.springCoilGroup = new THREE.Group();
    this.coverMesh = null;
    this.pipingGroup = new THREE.Group();
    this.labelGroup = new THREE.Group();

    // Procedural PBR Textures
    this.textures = {};

    this.initScene();
    this.initLighting();
    this.initPBRTextures();
    this.initControls();
    this.addGroundShadow();

    window.addEventListener('resize', () => this.onWindowResize());
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0b101d');
    this.scene.fog = new THREE.FogExp2('#0b101d', 0.008);

    this.camera = new THREE.PerspectiveCamera(36, this.width / this.height, 0.1, 100);
    this.adjustCameraForScreen();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    this.container.appendChild(this.renderer.domElement);
    this.scene.add(this.labelGroup);
    this.scene.add(this.pipingGroup);
    this.scene.add(this.springCoilGroup);
  }

  adjustCameraForScreen() {
    const aspect = this.width / this.height;
    if (aspect < 1.0) {
      // Portrait Smartphone Screen: Pull camera back so full mattress & exploded layers fit perfectly!
      this.camera.position.set(5.8, 4.4, 7.2);
    } else {
      // Desktop / Tablet Landscape Screen
      this.camera.position.set(4.4, 3.2, 5.4);
    }
  }

  initLighting() {
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.65);
    this.scene.add(ambientLight);

    this.sunLight = new THREE.DirectionalLight('#fffdf0', 2.4);
    this.sunLight.position.set(6, 10, 5);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 25;
    this.sunLight.shadow.camera.left = -6;
    this.sunLight.shadow.camera.right = 6;
    this.sunLight.shadow.camera.top = 6;
    this.sunLight.shadow.camera.bottom = -6;
    this.sunLight.shadow.bias = -0.0002;
    this.scene.add(this.sunLight);

    const keyFillLight = new THREE.DirectionalLight('#e0f2fe', 0.9);
    keyFillLight.position.set(-6, 7, 4);
    this.scene.add(keyFillLight);

    const emeraldRimLight = new THREE.DirectionalLight('#10b981', 1.25);
    emeraldRimLight.position.set(-5, 4, -6);
    this.scene.add(emeraldRimLight);
  }

  initControls() {
    const THREE = window.THREE;
    const ControlsClass = THREE ? (THREE.OrbitControls || window.OrbitControls) : null;
    if (ControlsClass) {
      this.controls = new ControlsClass(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
      this.controls.minDistance = 1.6;
      this.controls.maxDistance = 12.0;
      this.controls.target.set(0, 0.3, 0);
    }
  }

  addGroundShadow() {
    const shadowPlaneGeo = new THREE.PlaneGeometry(25, 25);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const ground = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const grid = new THREE.GridHelper(16, 32, '#10b981', '#1e293b');
    grid.position.y = -0.012;
    grid.material.opacity = 0.18;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  /* PROCEDURAL PBR TEXTURES GENERATORS */
  initPBRTextures() {
    this.textures.quiltNormal = this.generateQuiltedNormalMap(1024);
    this.textures.quiltRoughness = this.generateQuiltedRoughnessMap(1024);

    this.textures.coverCotton = this.generateFabricDiffuse('#ffffff', '#e2e8f0', '#cbd5e1');
    this.textures.coverBlack = this.generateFabricDiffuse('#18181b', '#27272a', '#52525b');
    this.textures.coverCashmere = this.generateFabricDiffuse('#fef3c7', '#fde047', '#d97706');

    this.textures.coconutDiffuse = this.generateCoconutDiffuse();
    this.textures.coconutNormal = this.generateCoconutNormalMap();

    this.textures.latexDiffuse = this.generateLatexDiffuse();
    this.textures.latexNormal = this.generateLatexNormalMap();

    this.textures.foamDiffuse = this.generateFoamDiffuse();
    this.textures.foamNormal = this.generateFoamNormalMap();

    this.textures.memoryDiffuse = this.generateMemoryDiffuse();
    this.textures.memoryNormal = this.generateMemoryNormalMap();

    this.textures.springPocketTex = this.generatePocketSpringTexture();
    this.textures.feltDiffuse = this.generateFeltDiffuse();
    this.textures.spunbondTexture = this.generateSpunbondTexture();
  }

  generateSpunbondTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = '#cbd5e1';
    for (let i = 0; i < 12000; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5);
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  generateCoconutDiffuse() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#3a1700'; ctx.fillRect(0, 0, 1024, 1024);

    for (let i = 0; i < 9000; i++) {
      const colors = ['#6a2c00', '#853a06', '#9c480c', '#4a1e00', '#250e00'];
      ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.lineWidth = Math.random() * 2.5 + 0.8;
      ctx.beginPath();
      const x = Math.random() * 1024, y = Math.random() * 1024;
      const len = Math.random() * 55 + 15;
      const angle = Math.random() * Math.PI * 2;
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  generateCoconutNormalMap() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const nx = (Math.random() - 0.5) * 1.5;
      const ny = (Math.random() - 0.5) * 1.5;
      const nz = 1.0;
      const len = Math.sqrt(nx*nx + ny*ny + nz*nz);
      data[i] = Math.round(((nx/len) * 0.5 + 0.5) * 255);
      data[i+1] = Math.round(((ny/len) * 0.5 + 0.5) * 255);
      data[i+2] = Math.round((nz/len) * 255);
      data[i+3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  generateLatexDiffuse() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fffbeb'; ctx.fillRect(0, 0, 512, 512);

    const step = 512 / 16;
    ctx.fillStyle = '#ca8a04';
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        const cx = c * step + step / 2;
        const cy = r * step + step / 2;
        ctx.fillStyle = '#a16207';
        ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#451a03';
        ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
      }
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  generateLatexNormalMap() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(128, 128, 255)'; ctx.fillRect(0, 0, size, size);

    const step = size / 16;
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        const cx = c * step + step / 2;
        const cy = r * step + step / 2;
        const rad = 7;
        const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, rad);
        grad.addColorStop(0, 'rgb(128, 128, 128)');
        grad.addColorStop(1, 'rgb(128, 128, 255)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();
      }
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  generateFoamDiffuse() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1d4ed8'; ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 8000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#60a5fa' : '#2563eb';
      ctx.beginPath(); ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 2 + 0.5, 0, Math.PI * 2); ctx.fill();
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  generateFoamNormalMap() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(128, 128, 255)'; ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgb(100, 150, 240)' : 'rgb(150, 100, 240)';
      ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  generateMemoryDiffuse() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#6b21a8'; ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 6000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#c084fc' : '#9333ea';
      ctx.beginPath(); ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 2.5 + 1, 0, Math.PI * 2); ctx.fill();
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  generateMemoryNormalMap() {
    return this.generateFoamNormalMap();
  }

  generatePocketSpringTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, 512, 512);

    const step = 512 / 8;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cx = c * step + step / 2;
        const cy = r * step + step / 2;

        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(cx, cy, step * 0.45, 0, Math.PI * 2); ctx.stroke();

        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(cx, cy, step * 0.3, 0, Math.PI * 2); ctx.stroke();
      }
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  generateFeltDiffuse() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#475569'; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#64748b' : '#334155';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2.5, 2.5);
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  generateQuiltedNormalMap(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');

    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;
    const cellSize = size / 8;
    const heightBuffer = new Float32Array(size * size);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = (x % cellSize) / cellSize - 0.5;
        const v = (y % cellSize) / cellSize - 0.5;
        const du = Math.abs(u + v);
        const dv = Math.abs(u - v);
        const dist = Math.max(du, dv);

        let height = Math.cos(Math.min(dist * Math.PI, Math.PI / 2));
        height = Math.pow(height, 2.5);
        heightBuffer[y * size + x] = height;
      }
    }

    const strength = 8.5;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const xLeft = heightBuffer[y * size + ((x - 1 + size) % size)];
        const xRight = heightBuffer[y * size + ((x + 1) % size)];
        const yUp = heightBuffer[((y - 1 + size) % size) * size + x];
        const yDown = heightBuffer[((y + 1) % size) * size + x];

        const dx = (xRight - xLeft) * strength;
        const dy = (yDown - yUp) * strength;
        const dz = 1.0;
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const idx = (y * size + x) * 4;
        data[idx] = Math.round(((dx / len) * 0.5 + 0.5) * 255);
        data[idx + 1] = Math.round(((dy / len) * 0.5 + 0.5) * 255);
        data[idx + 2] = Math.round((dz / len) * 255);
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  generateQuiltedRoughnessMap(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#bbbbbb'; ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = '#555555'; ctx.lineWidth = 6;
    const cellSize = size / 8;

    for (let x = -size; x < size * 2; x += cellSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + size, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, size); ctx.lineTo(x + size, 0); ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  generateFabricDiffuse(baseColor, seamColor, threadColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = baseColor; ctx.fillRect(0, 0, 1024, 1024);

    ctx.fillStyle = seamColor;
    for (let i = 0; i < 20000; i++) {
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
    }

    ctx.strokeStyle = threadColor; ctx.lineWidth = 3.5;
    const step = 128;
    for (let x = -1024; x < 1024 * 2; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 1024, 1024); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, 1024); ctx.lineTo(x + 1024, 0); ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  /* ==========================================================================
     DYNAMIC 3D MESH BUILDER WITH HIGH REALISM FABRIC COVER & CORDS
     ========================================================================== */
  updateMattress(widthCm, lengthCm, layers, coverType, explodeFactor, cutawayEnabled, coverEnabled) {
    this.widthCm = widthCm;
    this.lengthCm = lengthCm;
    this.currentLayers = layers;
    this.coverType = coverType;
    this.explodeFactor = explodeFactor;
    this.cutawayEnabled = cutawayEnabled;
    this.coverEnabled = coverEnabled;

    // Clear old meshes
    this.layerMeshes.forEach(mesh => this.scene.remove(mesh));
    this.layerMeshes = [];

    while (this.springCoilGroup.children.length > 0) {
      this.springCoilGroup.remove(this.springCoilGroup.children[0]);
    }
    if (this.coverMesh) this.scene.remove(this.coverMesh);

    while (this.pipingGroup.children.length > 0) {
      this.pipingGroup.remove(this.pipingGroup.children[0]);
    }
    while (this.labelGroup.children.length > 0) {
      this.labelGroup.remove(this.labelGroup.children[0]);
    }

    const scaleFactor = 0.02;
    const meshW = widthCm * scaleFactor;
    const meshL = lengthCm * scaleFactor;

    let totalHeightCm = 0;
    layers.forEach(l => { totalHeightCm += l.thickness; });
    const totalMeshH = totalHeightCm * scaleFactor;

    this.controls.target.set(0, totalMeshH / 2, 0);

    // Stacked Material Layers
    let currentY = 0;
    const explodeGap = 0.5 * explodeFactor;

    layers.forEach((layer, index) => {
      const layerH = layer.thickness * scaleFactor;
      const layerYCenter = currentY + layerH / 2 + index * explodeGap;

      const materialProps = this.getMaterialProps(layer.matId);

      if (materialProps.texture) {
        materialProps.texture.repeat.set(widthCm / 40, lengthCm / 40);
      }
      if (materialProps.normalMap) {
        materialProps.normalMap.repeat.set(widthCm / 40, lengthCm / 40);
      }

      if (layer.matId === 'pocket-spring' || layer.matId === 'multipocket') {
        this.buildFoamBorderBox(meshW, layerH, meshL, layerYCenter);
        this.renderExactSpunbondPocketSprings(meshW, layerH, meshL, layerYCenter, layer.matId);
      } else {
        const layerGeo = new THREE.BoxGeometry(meshW, layerH, meshL);
        const layerMat = new THREE.MeshStandardMaterial({
          map: materialProps.texture,
          normalMap: materialProps.normalMap || null,
          normalScale: materialProps.normalScale || new THREE.Vector2(1, 1),
          color: materialProps.color,
          roughness: materialProps.roughness || 0.6,
          metalness: materialProps.metalness || 0.1,
        });

        const layerMesh = new THREE.Mesh(layerGeo, layerMat);
        layerMesh.position.set(0, layerYCenter, 0);
        layerMesh.castShadow = true;
        layerMesh.receiveShadow = true;

        this.scene.add(layerMesh);
        this.layerMeshes.push(layerMesh);
      }

      // 3D Floating Label Badge
      if (this.explodeFactor > 0.1) {
        this.add3DLabel(layer.name + ` (${layer.thickness} см)`, 0, layerYCenter, meshL / 2 + 0.25);
      }

      currentY += layerH;
    });

    // Ultra-Realistic Diamond Quilted Cover
    if (coverEnabled && this.explodeFactor < 0.2) {
      const coverGeo = new THREE.BoxGeometry(meshW + 0.02, totalMeshH + 0.02, meshL + 0.02, 32, 32, 32);

      let diffuseTex = this.textures.coverCotton;
      if (coverType === 'cashmere') diffuseTex = this.textures.coverCashmere;
      if (coverType === 'black') diffuseTex = this.textures.coverBlack;

      const quiltNorm = this.textures.quiltNormal;
      const quiltRough = this.textures.quiltRoughness;

      const repeatX = Math.round(widthCm / 18);
      const repeatY = Math.round(lengthCm / 18);
      diffuseTex.repeat.set(repeatX, repeatY);
      quiltNorm.repeat.set(repeatX, repeatY);
      quiltRough.repeat.set(repeatX, repeatY);

      const coverMat = new THREE.MeshStandardMaterial({
        map: diffuseTex,
        normalMap: quiltNorm,
        normalScale: new THREE.Vector2(2.4, 2.4),
        roughnessMap: quiltRough,
        roughness: 0.65,
        metalness: 0.05,
        transparent: cutawayEnabled,
        opacity: cutawayEnabled ? 0.38 : 0.99,
        side: THREE.DoubleSide
      });

      this.coverMesh = new THREE.Mesh(coverGeo, coverMat);
      this.coverMesh.position.set(0, totalMeshH / 2, 0);
      this.coverMesh.castShadow = true;
      this.coverMesh.receiveShadow = true;
      this.scene.add(this.coverMesh);

      this.buildPerimeterPipingCord(meshW + 0.02, totalMeshH + 0.02, meshL + 0.02, coverType);
    }
  }

  buildFoamBorderBox(w, h, l, yCenter) {
    const borderThickness = 0.12;
    const foamMat = new THREE.MeshStandardMaterial({
      color: '#fef08a',
      roughness: 0.7
    });

    const wallFrontGeo = new THREE.BoxGeometry(w, h, borderThickness);
    const wallFront = new THREE.Mesh(wallFrontGeo, foamMat);
    wallFront.position.set(0, yCenter, l / 2 - borderThickness / 2);
    this.springCoilGroup.add(wallFront);

    const wallBack = new THREE.Mesh(wallFrontGeo, foamMat);
    wallBack.position.set(0, yCenter, -l / 2 + borderThickness / 2);
    this.springCoilGroup.add(wallBack);

    const wallLeftGeo = new THREE.BoxGeometry(borderThickness, h, l - borderThickness * 2);
    const wallLeft = new THREE.Mesh(wallLeftGeo, foamMat);
    wallLeft.position.set(-w / 2 + borderThickness / 2, yCenter, 0);
    this.springCoilGroup.add(wallLeft);

    const wallRight = new THREE.Mesh(wallLeftGeo, foamMat);
    wallRight.position.set(w / 2 - borderThickness / 2, yCenter, 0);
    this.springCoilGroup.add(wallRight);
  }

  renderExactSpunbondPocketSprings(w, h, l, yCenter, matId) {
    const isMulti = matId === 'multipocket';
    const cols = isMulti ? 10 : 7;
    const rows = isMulti ? 12 : 9;

    const borderMargin = 0.14;
    const innerW = w - borderMargin * 2;
    const innerL = l - borderMargin * 2;

    const stepX = innerW / cols;
    const stepZ = innerL / rows;

    const springHeight = h * 0.94;
    const outerRadius = Math.min(stepX, stepZ) * 0.46;

    const pouchGeo = this.createRibbedPouchGeometry(outerRadius, springHeight, 6);

    const spunbondMat = new THREE.MeshStandardMaterial({
      map: this.textures.spunbondTexture,
      color: '#f8fafc',
      roughness: 0.85,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    const steelWireMat = new THREE.MeshStandardMaterial({
      color: isMulti ? '#10b981' : '#cbd5e1',
      metalness: 0.92,
      roughness: 0.15
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = -innerW / 2 + c * stepX + stepX / 2;
        const cz = -innerL / 2 + r * stepZ + stepZ / 2;

        const pouchMesh = new THREE.Mesh(pouchGeo, spunbondMat);
        pouchMesh.position.set(cx, yCenter, cz);
        pouchMesh.castShadow = true;
        this.springCoilGroup.add(pouchMesh);

        if (c === 0 || c === cols - 1 || r === 0 || r === rows - 1 || (c % 2 === 0 && r % 2 === 0)) {
          const points = [];
          const turns = 5.5;
          const coilRadius = outerRadius * 0.78;

          for (let t = 0; t <= 60; t++) {
            const angle = (t / 60) * Math.PI * 2 * turns;
            const y = -springHeight / 2 + (t / 60) * springHeight;
            const x = Math.cos(angle) * coilRadius;
            const z = Math.sin(angle) * coilRadius;
            points.push(new THREE.Vector3(cx + x, yCenter + y, cz + z));
          }

          const curve = new THREE.CatmullRomCurve3(points);
          const coilGeo = new THREE.TubeGeometry(curve, 36, 0.0075, 6, false);
          const coilMesh = new THREE.Mesh(coilGeo, steelWireMat);
          this.springCoilGroup.add(coilMesh);
        }
      }
    }
  }

  createRibbedPouchGeometry(radius, height, numRibs) {
    const radialSegments = 24;
    const heightSegments = numRibs * 6;
    const geo = new THREE.CylinderGeometry(radius, radius, height, radialSegments, heightSegments);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const normY = (y + height / 2) / height;

      const ribIndent = Math.sin(normY * Math.PI * numRibs * 2);
      const scale = 1.0 - 0.07 * Math.pow(Math.max(0, ribIndent), 1.5);

      pos.setX(i, pos.getX(i) * scale);
      pos.setZ(i, pos.getZ(i) * scale);
    }

    geo.computeVertexNormals();
    return geo;
  }

  buildPerimeterPipingCord(w, h, l, coverType) {
    const halfW = w / 2;
    const halfL = l / 2;
    const radius = 0.025;

    let cordColor = '#10b981';
    if (coverType === 'black') cordColor = '#34d399';
    if (coverType === 'cashmere') cordColor = '#059669';

    const cordMat = new THREE.MeshStandardMaterial({ color: cordColor, roughness: 0.3 });

    [h, 0].forEach(yPos => {
      const path = new THREE.CurvePath();
      const p1 = new THREE.Vector3(-halfW, yPos, -halfL);
      const p2 = new THREE.Vector3(halfW, yPos, -halfL);
      const p3 = new THREE.Vector3(halfW, yPos, halfL);
      const p4 = new THREE.Vector3(-halfW, yPos, halfL);

      path.add(new THREE.LineCurve3(p1, p2));
      path.add(new THREE.LineCurve3(p2, p3));
      path.add(new THREE.LineCurve3(p3, p4));
      path.add(new THREE.LineCurve3(p4, p1));

      const tubeGeo = new THREE.TubeGeometry(path, 64, radius, 8, true);
      const tubeMesh = new THREE.Mesh(tubeGeo, cordMat);
      this.pipingGroup.add(tubeMesh);
    });
  }

  getMaterialProps(matId) {
    switch (matId) {
      case 'coconut':
        return {
          texture: this.textures.coconutDiffuse,
          normalMap: this.textures.coconutNormal,
          normalScale: new THREE.Vector2(2.5, 2.5),
          color: '#ffffff',
          roughness: 0.95
        };
      case 'latex':
        return {
          texture: this.textures.latexDiffuse,
          normalMap: this.textures.latexNormal,
          normalScale: new THREE.Vector2(1.5, 1.5),
          color: '#ffffff',
          roughness: 0.35
        };
      case 'foam':
        return {
          texture: this.textures.foamDiffuse,
          normalMap: this.textures.foamNormal,
          normalScale: new THREE.Vector2(1.2, 1.2),
          color: '#ffffff',
          roughness: 0.6
        };
      case 'memory':
        return {
          texture: this.textures.memoryDiffuse,
          normalMap: this.textures.memoryNormal,
          normalScale: new THREE.Vector2(1.2, 1.2),
          color: '#ffffff',
          roughness: 0.5
        };
      case 'pocket-spring':
      case 'multipocket':
        return {
          texture: this.textures.springPocketTex,
          color: '#ffffff',
          roughness: 0.45,
          metalness: 0.2
        };
      case 'felt':
        return {
          texture: this.textures.feltDiffuse,
          color: '#ffffff',
          roughness: 0.85
        };
      default:
        return { texture: null, color: '#10b981', roughness: 0.5 };
    }
  }

  add3DLabel(text, x, y, z) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    if (ctx.roundRect) {
      ctx.roundRect(10, 10, 236, 44, 10);
    } else {
      ctx.rect(10, 10, 236, 44);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 19px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(x, y, z);
    sprite.scale.set(1.2, 0.3, 1);
    this.labelGroup.add(sprite);
  }

  resetCameraView() {
    this.adjustCameraForScreen();
    this.controls.target.set(0, 0.3, 0);
  }

  topCameraView() {
    this.camera.position.set(0, 7.5, 0.01);
    this.controls.target.set(0, 0.3, 0);
  }

  onWindowResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.adjustCameraForScreen();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.controls.state == -1) {
      this.scene.rotation.y += 0.0012;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
