import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import GUI from './vendor/lil-gui.esm.min.js';

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x03070f, 0.035);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(8, 7, 18);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambient = new THREE.AmbientLight(0x6fa0ff, 0.5);
scene.add(ambient);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(6, 10, 4);
scene.add(dirLight);

const params = {
  wavelength: 0.6, // world units
  slitSeparation: 3,
  slitWidth: 0.25,
  slitCount: 2,
  slitMaskMode: 'all', // 'all' | 'single' | 'cycle'
  activeSlit: 0,
  cyclePeriod: 2.5,
  slitPlaneZ: 5,
  screenZ: 12.5,
  screenWidth: 22,
  detectorOffset: 7.5, // screenZ - slitPlaneZ
  amplitudeScale: 0.2,
  waveSpeed: 0.5,
  emissionPerSpeed: 20, // photons per second per unit speed
  derivedEmission: 0,
  mode: 'wave', // 'wave' | 'particle'
  autoRotate: false,
  showField: true,
  showWall: true,
  showIndicators: true,
  showTrails: true,
  paused: false,
  resetDetections: () => resetHits(),
  resetCamera: () => setCameraPreset('threeQuarter'),
  pauseSim: () => (params.paused = true),
  resumeSim: () => (params.paused = false),
  view: 'threeQuarter',
};

controls.target.set(0, 0, params.slitPlaneZ);
controls.update();

const source = new THREE.Vector3(0, 0, 0);
const clock = new THREE.Clock();
let field, wall, screenBase, screenOverlay, hitTexture, hitCtx, distribution;
let cumulative;
let hitSprites = [];
let hitSpriteMaterial;
let hitBarMaterial;
let simTime = 0;
let slitPositions = [];
let openSlitIndices = [];
let openSlitPositions = [];
let lastMaskSignature = '';
let trails = [];
let trailMaterial;

function currentEmissionRate() {
  return params.emissionPerSpeed * params.waveSpeed;
}

function resetHits() {
  clearHits();
}

init();
animate();

// ----- Setup functions ----------------------------------------------------

function init() {
  addBackground();
  addSource();
  makeHitSpriteMaterial();
  makeHitBarMaterial();
  makeTrailMaterial();
  updateSlitMask(0, true);
  buildScreen();
  buildField();
  setupGui();
  params.derivedEmission = currentEmissionRate();
  window.addEventListener('resize', onResize);
}

function addBackground() {
  const stars = new THREE.Points(
    new THREE.BufferGeometry().setAttribute(
      'position',
      new THREE.Float32BufferAttribute(randomSpherePoints(600, 70), 3)
    ),
    new THREE.PointsMaterial({ color: 0x335577, size: 0.1, transparent: true })
  );
  scene.add(stars);
}

function randomSpherePoints(count, radius) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(Math.random());
    const sinPhi = Math.sin(phi);
    arr.push(
      r * sinPhi * Math.cos(theta),
      r * sinPhi * Math.sin(theta),
      r * Math.cos(phi)
    );
  }
  return arr;
}

function addSource() {
  const geo = new THREE.SphereGeometry(0.25, 32, 32);
  const mat = new THREE.MeshPhongMaterial({
    color: 0x7fe5ff,
    emissive: 0x0c3a4a,
    emissiveIntensity: 1.4,
    shininess: 120,
  });
  const emitter = new THREE.Mesh(geo, mat);
  emitter.position.copy(source);
  scene.add(emitter);

  // halo to show emission region
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.35, 0.03, 8, 64),
    new THREE.MeshBasicMaterial({ color: 0x6dd1ff, transparent: true, opacity: 0.6 })
  );
  ring.rotation.x = Math.PI / 2;
  emitter.add(ring);
}

function buildWall() {
  if (wall) scene.remove(wall);
  const span = Math.max(2, (params.slitCount - 1) * params.slitSeparation + params.slitWidth);
  const wallWidth = Math.max(params.screenWidth, span + 4, 8);
  const wallHeight = 6;
  const wallThickness = 0.8;
  const blocks = new THREE.Group();
  const color = 0x202a3a;
  const slitHeight = wallHeight * 0.85;
  const capHeight = (wallHeight - slitHeight) / 2;

  const positions = computeSlitPositions();
  const openings = openSlitPositions.length ? openSlitPositions : positions;
  const halfW = wallWidth / 2;
  let cursor = -halfW;

  const makeBlock = (xStart, xEnd, yCenter, h) => {
    const width = xEnd - xStart;
    if (width <= 0.02 || h <= 0.02) return;
    const geo = new THREE.BoxGeometry(width, h, wallThickness);
    const mat = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.05,
      roughness: 0.65,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((xStart + xEnd) / 2, yCenter, 0);
    blocks.add(mesh);
  };

  // top and bottom caps (solid)
  makeBlock(-halfW, halfW, (slitHeight / 2) + capHeight / 2, capHeight);
  makeBlock(-halfW, halfW, -(slitHeight / 2) - capHeight / 2, capHeight);

  // segments between openings within slit-height band
  openings
    .map(x => ({ start: x - params.slitWidth / 2, end: x + params.slitWidth / 2 }))
    .sort((a, b) => a.start - b.start)
    .forEach(open => {
      makeBlock(cursor, open.start, 0, slitHeight);
      cursor = open.end;
    });
  makeBlock(cursor, halfW, 0, slitHeight);

  wall = blocks;
  wall.position.z = params.slitPlaneZ;
  scene.add(wall);
}

function makeSlitAlphaTexture(width, height) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, c.width, c.height);

  const slitWidthPx = (params.slitWidth / width) * c.width;
  const midX = c.width / 2;
  const midY = c.height / 2;
  const slitHeight = c.height * 0.9;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'black';

  const positions = computeSlitPositions();
  openSlitIndices.forEach(idx => {
    const xPos = positions[idx];
    const px = (xPos / width) * c.width;
    ctx.fillRect(
      midX + px - slitWidthPx / 2,
      midY - slitHeight / 2,
      slitWidthPx,
      slitHeight
    );
  });

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

function buildScreen() {
  if (screenBase) scene.remove(screenBase);
  if (screenOverlay) scene.remove(screenOverlay);
  const aspect = 2;
  const width = params.screenWidth;
  const height = width / aspect;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = Math.round(canvas.width / aspect);
  hitCtx = canvas.getContext('2d');
  hitTexture = new THREE.CanvasTexture(canvas);
  hitTexture.colorSpace = THREE.SRGBColorSpace;
  hitTexture.minFilter = THREE.LinearFilter;
  hitTexture.magFilter = THREE.LinearFilter;
  clearHits();

  const geo = new THREE.PlaneGeometry(width, height, 1, 1);
  // base plate (constant color)
  const baseMat = new THREE.MeshBasicMaterial({
    color: 0x162235,
    side: THREE.DoubleSide,
    depthWrite: true,
    depthTest: true,
  });
  screenBase = new THREE.Mesh(geo, baseMat);
  screenBase.position.z = params.screenZ;
  screenBase.name = 'detector-base';
  screenBase.renderOrder = 0;
  scene.add(screenBase);

  // overlay for hits (additive, transparent)
  const overlayMat = new THREE.MeshBasicMaterial({
    map: hitTexture,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    color: 0xffffff,
  });
  screenOverlay = new THREE.Mesh(geo.clone(), overlayMat);
  screenOverlay.position.z = params.screenZ + 0.0005;
  screenOverlay.name = 'detector-overlay';
  screenOverlay.renderOrder = 1;
  scene.add(screenOverlay);

  rebuildDistribution();
}

function getScreenHeight() {
  return screenOverlay?.geometry?.parameters?.height ?? params.screenWidth / 2;
}

function buildField() {
  if (field) scene.remove(field.mesh);
  const span = Math.max(2, (params.slitCount - 1) * params.slitSeparation + params.slitWidth);
  const width = Math.max(params.screenWidth, span + 4);
  const zStart = 0;
  const depth = Math.max(params.screenZ - zStart, 0.1);
  const segX = 96;
  const segZ = 180;
  const vertexCount = (segX + 1) * (segZ + 1);
  const positions = new Float32Array(vertexCount * 3);
  const colors = new Float32Array(vertexCount * 3);

  let ptr = 0;
  for (let z = 0; z <= segZ; z++) {
    const zPos = zStart + (z / segZ) * depth;
    for (let x = 0; x <= segX; x++) {
      const xPos = -width / 2 + (x / segX) * width;
      positions[ptr] = xPos;
      positions[ptr + 1] = 0;
      positions[ptr + 2] = zPos;
      colors[ptr] = 0.2;
      colors[ptr + 1] = 0.4;
      colors[ptr + 2] = 0.8;
      ptr += 3;
    }
  }

  const indices = [];
  for (let z = 0; z < segZ; z++) {
    for (let x = 0; x < segX; x++) {
      const a = z * (segX + 1) + x;
      const b = a + segX + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setIndex(indices);

  const mat = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  scene.add(mesh);

  field = { mesh, geo, positions, colors, segX, segZ, depth, width };
}

// ----- Hit flash sprites --------------------------------------------------

function makeHitSpriteMaterial() {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,0.9)');
  g.addColorStop(0.3, 'rgba(120,200,255,0.8)');
  g.addColorStop(1, 'rgba(120,200,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  hitSpriteMaterial = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}

function makeHitBarMaterial() {
  hitBarMaterial = new THREE.MeshBasicMaterial({
    color: 0x8cd5ff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    depthTest: false,
  });
}

function makeTrailMaterial() {
  trailMaterial = new THREE.LineBasicMaterial({
    color: 0xffd27f,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
  });
}

function spawnHitFlash(x) {
  if (!hitSpriteMaterial || !params.showIndicators) return;
  const sprite = new THREE.Sprite(hitSpriteMaterial.clone());
  sprite.scale.set(0.5, 0.5, 0.5);
  sprite.position.set(x, 0, params.screenZ + 0.002);
  sprite.material.opacity = 1;
  scene.add(sprite);
  hitSprites.push({ mesh: sprite, life: 0, maxLife: 2.4 });

  if (hitBarMaterial) {
    const h = getScreenHeight(); // detector height
    const bar = new THREE.Mesh(
      new THREE.PlaneGeometry(0.06, h),
      hitBarMaterial.clone()
    );
    bar.position.set(x, 0, params.screenZ + 0.001);
    bar.renderOrder = 1;
    bar.userData.baseHeight = h;
    scene.add(bar);
    hitSprites.push({ mesh: bar, life: 0, maxLife: 2.4, isBar: true });
  }
}

function updateHitFlashes(dt) {
  if (!hitSprites.length) return;
  for (const h of hitSprites) {
    h.life += dt;
    const t = h.maxLife > 0 ? h.life / h.maxLife : 1;
    const fade = Math.max(0, 1 - t);
    h.mesh.material.opacity = fade;
    if (!h.isBar) {
      const s = 0.6 + 0.6 * t;
      h.mesh.scale.set(s, s, s);
      h.mesh.position.z = params.screenZ + 0.002;
    } else {
      h.mesh.position.z = params.screenZ + 0.001;
      const screenHeight = getScreenHeight();
      const base = h.mesh.userData.baseHeight || screenHeight;
      h.mesh.scale.set(1, screenHeight / base, 1);
    }
  }
  hitSprites = hitSprites.filter(h => {
    const keep = h.life < h.maxLife;
    if (!keep) scene.remove(h.mesh);
    return keep;
  });

  // trails
  if (trails.length) {
    for (const tr of trails) {
      tr.life += dt;
      const t = tr.maxLife > 0 ? tr.life / tr.maxLife : 1;
      tr.mesh.material.opacity = Math.max(0, 1 - t);
      if (tr.mesh.material.opacity <= 0) scene.remove(tr.mesh);
    }
    trails = trails.filter(tr => tr.life < tr.maxLife);
  }
}

// ----- Simulation math ----------------------------------------------------

function waveNumber() {
  return (2 * Math.PI) / params.wavelength;
}

function angularFrequency() {
  return waveNumber() * params.waveSpeed;
}

function softClamp(v, limit = 2.0) {
  return Math.tanh(v / limit) * limit;
}

function computeSlitPositions() {
  const n = Math.max(1, Math.round(params.slitCount));
  const d = params.slitSeparation;
  const start = -((n - 1) / 2) * d;
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(start + i * d);
  }
  slitPositions = arr;
  return arr;
}

function updateSlitMask(time, force = false) {
  const positions = computeSlitPositions();
  let openIdx = [];
  if (params.slitMaskMode === 'single') {
    const idx = Math.max(0, Math.min(positions.length - 1, Math.round(params.activeSlit)));
    openIdx = [idx];
  } else if (params.slitMaskMode === 'cycle') {
    const idx = Math.max(0, Math.min(positions.length - 1, Math.floor(time / Math.max(0.1, params.cyclePeriod)) % positions.length));
    openIdx = [idx];
  } else {
    openIdx = positions.map((_, i) => i);
  }
  openSlitIndices = openIdx;
  openSlitPositions = openIdx.map(i => positions[i]);
  const sig = openSlitIndices.join(',');
  if (force || sig !== lastMaskSignature) {
    lastMaskSignature = sig;
    buildWall();
    rebuildDistribution();
  }
}

function amplitudeAtPoint(x, z, t) {
  const k = waveNumber();
  const omega = angularFrequency();
  if (z <= params.slitPlaneZ - 0.05) {
    // Pre-slit region: spherical wave from source
    const r = Math.hypot(x - source.x, z - source.z);
    const phase = k * r - omega * t;
    return softClamp(Math.sin(phase) / Math.max(r, 0.15));
  }
  const slitZ = params.slitPlaneZ;
  const slits = openSlitPositions.length ? openSlitPositions : computeSlitPositions();
  let amp = 0;
  for (const sx of slits) {
    const rSource = Math.hypot(sx - source.x, slitZ - source.z);
    const r = Math.hypot(x - sx, z - slitZ);
    const totalR = r + rSource;
    const phase = k * totalR - omega * t;
    amp += Math.sin(phase) / Math.max(r, 0.15);
  }
  return softClamp(amp, 2.5);
}

function intensityAtScreenX(x) {
  // time-averaged intensity using N-path interference with finite slit width envelope
  const L = Math.max(params.screenZ - params.slitPlaneZ, 0.001);
  const k = waveNumber();
  const a = params.slitWidth;
  const slits = openSlitPositions.length ? openSlitPositions : computeSlitPositions();
  if (!slits.length) return 0;
  let real = 0;
  let imag = 0;
  for (const s of slits) {
    const r = Math.sqrt(Math.pow(x - s, 2) + L * L);
    real += Math.cos(k * r) / r;
    imag += Math.sin(k * r) / r;
  }
  const single = singleSlitEnvelope(x, a, L);
  const I = (real * real + imag * imag) * single;
  return Math.max(I, 0);
}

function particleIntensityAtScreenX(x) {
  // classical particles: straight trajectories; approximate as Gaussians centered at each slit
  const sigma = Math.max(0.1, params.slitWidth * 0.35);
  const slits = openSlitPositions.length ? openSlitPositions : computeSlitPositions();
  if (!slits.length) return 0;
  let sum = 0;
  for (const s of slits) {
    const dx = x - s;
    sum += Math.exp(-0.5 * (dx * dx) / (sigma * sigma));
  }
  return sum;
}

function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function sampleParticleX() {
  const slits = openSlitPositions.length ? openSlitPositions : computeSlitPositions();
  if (!slits.length) return 0;
  const s = slits[Math.floor(Math.random() * slits.length)];
  const sigma = Math.max(0.1, params.slitWidth * 0.35);
  return s + randn() * sigma;
}

function singleSlitEnvelope(x, a, L) {
  // sinc^2 envelope approximation
  const beta = (Math.PI * a * x) / (params.wavelength * L);
  if (Math.abs(beta) < 1e-6) return 1;
  const s = Math.sin(beta) / beta;
  return s * s;
}

// ----- Detection distribution --------------------------------------------

function rebuildDistribution() {
  const samples = 800;
  distribution = new Float32Array(samples);
  cumulative = new Float32Array(samples);
  const halfW = params.screenWidth / 2;
  let sum = 0;
  for (let i = 0; i < samples; i++) {
    const x = -halfW + (i / (samples - 1)) * (params.screenWidth);
    const val = params.mode === 'particle' ? particleIntensityAtScreenX(x) : intensityAtScreenX(x);
    distribution[i] = val;
    sum += val;
  }
  if (sum <= 0) {
    for (let i = 0; i < samples; i++) {
      cumulative[i] = (i + 1) / samples;
    }
    return;
  }
  let running = 0;
  for (let i = 0; i < samples; i++) {
    running += distribution[i] / sum;
    cumulative[i] = running;
  }
}

function sampleScreenX() {
  if (params.mode === 'particle') return sampleParticleX();
  const r = Math.random();
  let low = 0;
  let high = cumulative.length - 1;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (cumulative[mid] < r) low = mid + 1;
    else high = mid;
  }
  const t = low / (cumulative.length - 1);
  return -params.screenWidth / 2 + t * params.screenWidth;
}

// ----- Rendering helpers --------------------------------------------------

function updateField(time) {
  if (!field) return;
  field.mesh.visible = params.showField && params.mode === 'wave';
  if (!field.mesh.visible) return;

  const pos = field.geo.getAttribute('position');
  const col = field.geo.getAttribute('color');
  const arr = pos.array;
  const colors = col.array;
  const kColor = 0.5;
  for (let i = 0; i < arr.length; i += 3) {
    const x = arr[i];
    const z = arr[i + 2];
    const amp = amplitudeAtPoint(x, z, time) * params.amplitudeScale;
    const h = THREE.MathUtils.clamp(amp, -1.2, 1.2);
    arr[i + 1] = amp;

    const shade = THREE.MathUtils.clamp(0.5 + h * 0.8, 0, 1);
    colors[i] = 0.2 + shade * 0.3;
    colors[i + 1] = 0.3 + shade * 0.5;
    colors[i + 2] = 0.8 - shade * 0.4;
  }
  pos.needsUpdate = true;
  col.needsUpdate = true;
  field.geo.computeVertexNormals();
}

function emitPhotons(dt) {
  if (!distribution || dt <= 0) return;
  const rate = currentEmissionRate();
  params.derivedEmission = rate;
  const events = rate * dt;
  const whole = Math.floor(events);
  const extra = Math.random() < events - whole ? 1 : 0;
  const count = whole + extra;
  if (count === 0) return;

  const ctx = hitCtx;
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const halfW = params.screenWidth / 2;
  for (let i = 0; i < count; i++) {
    const slitX = pickCurrentSlit();
    const xWorld = sampleScreenX();
    const xCanvas = Math.round(((xWorld + halfW) / (params.screenWidth)) * w);
    const yCanvas = h / 2 + (Math.random() - 0.5) * h * 0.01;

    const radius = 1;
    const g = ctx.createRadialGradient(xCanvas, yCanvas, 0, xCanvas, yCanvas, radius * 2.0);
    g.addColorStop(0, 'rgba(120,200,255,0.9)');
    g.addColorStop(1, 'rgba(120,200,255,0)');
    ctx.fillStyle = g;
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.arc(xCanvas, yCanvas, radius * (0.5 + Math.random()), 0, Math.PI * 2);
    ctx.fill();

    spawnHitFlash(xWorld);
    spawnParticleTrail(slitX, xWorld);
  }
  hitTexture.needsUpdate = true;
}

function clearHits() {
  if (!hitCtx) return;
  // fully clear detector overlay
  hitCtx.clearRect(0, 0, hitCtx.canvas.width, hitCtx.canvas.height);
  hitCtx.fillStyle = 'rgba(0,0,0,0)';
  hitCtx.fillRect(0, 0, hitCtx.canvas.width, hitCtx.canvas.height);
  hitTexture.needsUpdate = true;
  hitSprites.forEach(s => scene.remove(s.mesh));
  hitSprites = [];
  trails.forEach(t => scene.remove(t.mesh));
  trails = [];
}

function moveExistingHitMarkers() {
  if (!hitSprites.length) return;
  const screenHeight = getScreenHeight();
  hitSprites.forEach(h => {
    if (h.isBar) {
      const base = h.mesh.userData.baseHeight || screenHeight;
      h.mesh.scale.set(1, screenHeight / base, 1);
      h.mesh.position.z = params.screenZ + 0.001;
    } else {
      h.mesh.position.z = params.screenZ + 0.002;
    }
  });
}

function pickCurrentSlit() {
  if (openSlitPositions.length) {
    if (params.slitMaskMode === 'all') {
      const idx = Math.floor(Math.random() * openSlitPositions.length);
      return openSlitPositions[idx];
    }
    return openSlitPositions[0];
  }
  const positions = computeSlitPositions();
  return positions[Math.floor(Math.random() * positions.length)];
}

function spawnParticleTrail(slitX, hitX) {
  if (!params.showTrails || !trailMaterial) return;
  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(slitX, 0, params.slitPlaneZ),
    new THREE.Vector3(hitX, 0, params.screenZ),
  ];
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geo, trailMaterial.clone());
  line.frustumCulled = false;
  scene.add(line);
  trails.push({ mesh: line, life: 0, maxLife: 1.8 });
}

// ----- GUI ---------------------------------------------------------------

function setupGui() {
  const gui = new GUI({ title: 'Controls', width: 320 });

  const fWave = gui.addFolder('Wave / Source');
  fWave.add(params, 'wavelength', 0.2, 1.5, 0.01).onChange(onParamsChange);
  fWave.add(params, 'amplitudeScale', 0.05, 0.6, 0.01);
  fWave.add(params, 'waveSpeed', 0.2, 8, 0.05).onChange(() => {
    params.derivedEmission = currentEmissionRate();
  });
  fWave
    .add(params, 'emissionPerSpeed', 1, 200, 1)
    .name('Emission per speed')
    .onChange(() => {
      params.derivedEmission = currentEmissionRate();
    });
  fWave
    .add(params, 'mode', { Wave: 'wave', Particle: 'particle' })
    .name('Mode')
    .onChange(onModeChange);
  fWave.add(params, 'showField').listen();

  const fSlits = gui.addFolder('Slits / Wall');
  const activeCtrl = fSlits.add(params, 'activeSlit', 0, 5, 1).name('Active slit');
  fSlits
    .add(params, 'slitCount', 1, 6, 1)
    .name('Number of slits')
    .onChange(() => {
      params.activeSlit = Math.min(params.activeSlit, params.slitCount - 1);
      activeCtrl.max(Math.max(0, params.slitCount - 1));
      onParamsChange();
    });
  fSlits.add(params, 'slitSeparation', 0.4, 6, 0.01).onChange(onParamsChange);
  fSlits.add(params, 'slitWidth', 0.05, 0.8, 0.01).onChange(onParamsChange);
  fSlits
    .add(params, 'slitMaskMode', { 'All open': 'all', 'Single slit': 'single', Cycle: 'cycle' })
    .name('Mask mode')
    .onChange(onParamsChange);
  activeCtrl
    .onChange(onParamsChange);
  fSlits.add(params, 'cyclePeriod', 0.5, 10, 0.1).name('Cycle period (s)').onChange(onParamsChange);
  fSlits.add(params, 'slitPlaneZ', 2, 12, 0.1).onChange(onGeometryChange);
  fSlits.add(params, 'showWall').name('Show wall').onChange(v => (wall.visible = v));

  const fDetector = gui.addFolder('Detector');
  fDetector
    .add(params, 'detectorOffset', 2, 32, 0.1)
    .name('Distance from slits')
    .onChange(val => {
      params.screenZ = params.slitPlaneZ + val;
      onGeometryChange();
    });
  fDetector.add(params, 'screenZ', 8, 36, 0.1).name('Screen Z').onChange(onGeometryChange);
  fDetector.add(params, 'screenWidth', 8, 30, 0.1).onChange(onGeometryChange);
  fDetector.add(params, 'showIndicators')
    .name('Show indicators')
    .onChange(v => {
      if (!v) {
        hitSprites.forEach(h => scene.remove(h.mesh));
        hitSprites = [];
      }
    });
  fDetector.add(params, 'showTrails').name('Show particle trails');
  fDetector.add(params, 'resetDetections').name('Reset hits');

  const fView = gui.addFolder('Camera / Playback');
  fView.add(params, 'autoRotate').name('Auto rotate');
  fView.add(params, 'pauseSim').name('Pause');
  fView.add(params, 'resumeSim').name('Continue');
  fView.add(params, 'resetCamera').name('Camera: center');
  fView
    .add(params, 'view', { '3/4': 'threeQuarter', Top: 'top', Side: 'side' })
    .name('Quick view')
    .onChange(v => setCameraPreset(v));

  fWave.open();
  fSlits.open();
  fDetector.open();
  fView.open();
}

function onParamsChange() {
  updateSlitMask(simTime, true);
  clearHits();
}

function onGeometryChange() {
  params.detectorOffset = params.screenZ - params.slitPlaneZ;
  updateSlitMask(simTime, true);
  buildScreen();
  buildField();
  clearHits();
  moveExistingHitMarkers();
  controls.target.set(0, 0, params.slitPlaneZ);
  controls.update();
}

function onModeChange() {
  params.showField = params.mode === 'wave' ? params.showField : false;
  rebuildDistribution();
  clearHits();
}

function setCameraPreset(name) {
  params.view = name;
  const L = params.screenZ;
  if (name === 'top') {
    camera.position.set(0, L * 0.9, params.screenZ);
  } else if (name === 'side') {
    camera.position.set(params.screenWidth * 0.9, 0.5 * (params.screenZ + params.slitPlaneZ), params.screenZ);
  } else {
    camera.position.set(8, 7, 18);
  }
  controls.update();
}

// ----- Main loop ---------------------------------------------------------

function animate() {
  requestAnimationFrame(animate);
  const dt = params.paused ? 0 : clock.getDelta();
  simTime += dt;
  updateSlitMask(simTime, false);
  controls.autoRotate = params.autoRotate;
  controls.update();
  updateField(simTime);
  emitPhotons(dt);
  updateHitFlashes(dt);
  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
