import {
  HandLandmarker,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";

// =========================================================================
// 1. SPECIES DEFINITIONS & BOTANICAL PRESETS
// =========================================================================
const FLOWER_SPECIES = [
  {
    id: "lily",
    name: "Hoa Ly Hoàng Gia (Royal Lily)",
    icon: "⚜️",
    desc: "Cụm hoa Bách Hợp đa tầng trắng hồng thanh khiết, nhụy vàng hổ phách",
    colors: {
      petalOuter: "#f472b6",
      petalInner: "#ffffff",
      petalBase: "#fef08a",
      center: "#b45309",
      stem: "#047857",
      leaf: "#10b981",
      glow: "rgba(253, 230, 138, 0.6)",
    },
    petalCount: 6,
    petalLayers: 2,
    petalType: "lily",
    clusterBranches: true,
  },
  {
    id: "lotus",
    name: "Hoa Sen Thần Thoại (Lotus)",
    icon: "🪷",
    desc: "Cánh hồng phớt thanh tao, nhụy vàng tỏa sáng, giọt sương mai",
    colors: {
      petalOuter: "#ec4899",
      petalInner: "#fbcfe8",
      petalBase: "#ffffff",
      center: "#f59e0b",
      stem: "#059669",
      leaf: "#10b981",
      glow: "rgba(236, 72, 153, 0.5)",
    },
    petalCount: 18,
    petalLayers: 3,
    petalType: "lotus",
    clusterBranches: true,
  },
  {
    id: "rose",
    name: "Hoa Hồng Nhung (Velvet Rose)",
    icon: "🌹",
    desc: "Cánh đỏ thắm xoắn ốc quý phái, kiêu sa và huyền bí",
    colors: {
      petalOuter: "#be123c",
      petalInner: "#f43f5e",
      petalBase: "#881337",
      center: "#fbbf24",
      stem: "#047857",
      leaf: "#059669",
      glow: "rgba(244, 63, 94, 0.5)",
    },
    petalCount: 24,
    petalLayers: 4,
    petalType: "rose",
    clusterBranches: true,
  },
  {
    id: "sunflower",
    name: "Hoa Hướng Dương (Sunflower)",
    icon: "🌻",
    desc: "Cánh vàng rực rỡ hướng về ánh dương với đĩa nhụy Fibonacci",
    colors: {
      petalOuter: "#f59e0b",
      petalInner: "#fde047",
      petalBase: "#d97706",
      center: "#451a03",
      stem: "#15803d",
      leaf: "#22c55e",
      glow: "rgba(245, 158, 11, 0.55)",
    },
    petalCount: 26,
    petalLayers: 2,
    petalType: "sunflower",
    clusterBranches: false,
  },
  {
    id: "sakura",
    name: "Hoa Anh Đào (Sakura)",
    icon: "🌸",
    desc: "Cụm hoa đào phớt hồng rực rỡ bay trong gió xuân lãng mạn",
    colors: {
      petalOuter: "#f472b6",
      petalInner: "#fdf2f8",
      petalBase: "#fbcfe8",
      center: "#e11d48",
      stem: "#78350f",
      leaf: "#84cc16",
      glow: "rgba(244, 114, 182, 0.45)",
    },
    petalCount: 10,
    petalLayers: 2,
    petalType: "sakura",
    clusterBranches: true,
  },
  {
    id: "cosmic",
    name: "Lan Dạ Quang (Cosmic Orchid)",
    icon: "🌌",
    desc: "Bioluminescent phát sáng dạ quang kỳ ảo với bụi sao ngân hà",
    colors: {
      petalOuter: "#06b6d4",
      petalInner: "#a855f7",
      petalBase: "#3b82f6",
      center: "#f0abfc",
      stem: "#0284c7",
      leaf: "#06b6d4",
      glow: "rgba(6, 182, 212, 0.75)",
    },
    petalCount: 14,
    petalLayers: 3,
    petalType: "cosmic",
    clusterBranches: true,
  },
];

let currentSpeciesIndex = 0;

// =========================================================================
// 2. DOM ELEMENTS & STATE
// =========================================================================
const appContainer = document.getElementById("appContainer");
const cameraPane = document.getElementById("cameraPane");
const flowerPane = document.getElementById("flowerPane");
const video = document.getElementById("video");
const overlayCanvas = document.getElementById("overlayCanvas");
const overlayCtx = overlayCanvas ? overlayCanvas.getContext("2d") : null;
const flowerCanvas = document.getElementById("flowerCanvas");
const flowerCtx = flowerCanvas ? flowerCanvas.getContext("2d") : null;

const growBar = document.getElementById("growBar");
const bloomBar = document.getElementById("bloomBar");
const growValueText = document.getElementById("growValueText");
const bloomValueText = document.getElementById("bloomValueText");
const stemValueText = document.getElementById("stemValueText");
const foliageValueText = document.getElementById("foliageValueText");
const petalValueText = document.getElementById("petalValueText");
const sparkleValueText = document.getElementById("sparkleValueText");

const speciesBadge = document.getElementById("speciesBadge");
const speciesBadgeIcon = document.getElementById("speciesBadgeIcon");
const speciesBadgeName = document.getElementById("speciesBadgeName");
const speciesDrawer = document.getElementById("speciesDrawer");
const speciesGrid = document.getElementById("speciesGrid");
const btnCloseDrawer = document.getElementById("btnCloseDrawer");

const loadingOverlay = document.getElementById("loadingOverlay");
const spinner = document.getElementById("spinner");
const overlayTitle = document.getElementById("overlayTitle");
const overlayDesc = document.getElementById("overlayDesc");
const startBtn = document.getElementById("startBtn");
const errorBanner = document.getElementById("errorBanner");
const flashOverlay = document.getElementById("flashOverlay");
const toast = document.getElementById("toast");

const btnSpecies = document.getElementById("btnSpecies");
const btnLayout = document.getElementById("btnLayout");
const btnSwap = document.getElementById("btnSwap");
const btnSwitchCam = document.getElementById("btnSwitchCam");
const btnSnapshot = document.getElementById("btnSnapshot");
const btnSound = document.getElementById("btnSound");
const btnFullscreen = document.getElementById("btnFullscreen");
const btnMirror = document.getElementById("btnMirror");
const btnSkeleton = document.getElementById("btnSkeleton");

// Layout modes
const LAYOUT_MODES = [
  { id: "layout-split", name: "Song song (Chia đôi)" },
  { id: "layout-pip", name: "Ô nhỏ góc (PiP)" },
  { id: "layout-flower-solo", name: "Chỉ hiện Hoa (Solo)" },
];
let currentLayoutIndex = 0;
let isSwapped = false;

// MediaPipe State
let handLandmarker = null;
let currentStream = null;
let currentFacingMode = "user";
let isMirrored = true;
let showSkeleton = true;
let soundEnabled = true;
let isRunning = false;
let lastVideoTime = -1;

// Multi-finger Simulation Parameters
let targetStemHeight = 0.35;
let targetFoliage = 0.35;
let targetBloom = 0.25;
let targetSparkle = 0.25;
let targetWind = 0.2;

let currentStemHeight = 0.35;
let currentFoliage = 0.35;
let currentBloom = 0.25;
let currentSparkle = 0.25;
let currentWind = 0.2;

// Real-time Hand Position Following
let targetHandX = 0.5;
let targetHandY = 0.5;
let currentHandX = 0.5;
let currentHandY = 0.5;
let hasHandsInFrame = false;

let windPhase = 0;

// Particle System
let particles = [];
let burstParticles = [];
const MAX_PARTICLES = 120;

// Active Hand Landmarks for Energy Constellation
let activeHandsData = [];

// =========================================================================
// 3. PROCEDURAL WEB AUDIO SYNTHESIZER
// =========================================================================
let audioCtx = null;
const PENTATONIC_PITCHES = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0];

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

let lastChimeTime = 0;
function playBotanicalChime(pitchIndex = 0, volume = 0.15) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    if (now - lastChimeTime < 0.10) return;
    lastChimeTime = now;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const freq = PENTATONIC_PITCHES[pitchIndex % PENTATONIC_PITCHES.length] || 440;
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.60);
  } catch (e) {}
}

function playShutterSound() {
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {}
}

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

// =========================================================================
// 4. MULTI-FINGER SPATIAL GESTURE RECOGNITION & HAND TRACKING
// =========================================================================
function dist(a, b) {
  if (!a || !b) return 0;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function processHandGestures(handResult) {
  activeHandsData = [];
  if (!handResult.landmarks || handResult.landmarks.length === 0) {
    hasHandsInFrame = false;
    targetHandX = 0.5;
    targetHandY = 0.5;
    return;
  }

  hasHandsInFrame = true;

  const hands = handResult.landmarks.map((lm, idx) => {
    const wrist = lm[0];
    const palm = lm[9];
    const thumbTip = lm[4];
    const indexTip = lm[8];
    const middleTip = lm[12];
    const ringTip = lm[16];
    const pinkyTip = lm[20];

    const handScale = dist(wrist, palm) || 0.1;

    // 1. Thumb + Index pinch distance
    const pinchThumbIndex = dist(thumbTip, indexTip) / handScale;
    const thumbIndexSpread = Math.min(1, Math.max(0, (pinchThumbIndex - 0.22) / 0.88));

    // 2. Middle + Ring finger spread
    const middleRingDist = (dist(indexTip, middleTip) + dist(middleTip, ringTip)) / (2 * handScale);
    const otherFingersSpread = Math.min(1, Math.max(0, (middleRingDist - 0.25) / 0.70));

    // 3. Pinky elevation / extension
    const pinkyExtension = (dist(wrist, pinkyTip) - dist(wrist, lm[17])) / handScale;
    const pinkyLift = Math.min(1, Math.max(0, (pinkyExtension - 0.1) / 0.8));

    // Screen X position with mirror adjustment
    const effectiveX = isMirrored ? (1 - palm.x) : palm.x;
    const effectiveY = palm.y;

    return {
      lm,
      wrist,
      palm,
      thumbTip,
      indexTip,
      middleTip,
      ringTip,
      pinkyTip,
      handScale,
      thumbIndexSpread,
      otherFingersSpread,
      pinkyLift,
      effectiveX,
      effectiveY,
      originalIndex: idx,
    };
  });

  // Calculate average hand position for real-time plant leaning/following
  targetHandX = hands.reduce((sum, h) => sum + h.effectiveX, 0) / hands.length;
  targetHandY = hands.reduce((sum, h) => sum + h.effectiveY, 0) / hands.length;

  // Sort hands from left to right (user perspective)
  hands.sort((a, b) => a.effectiveX - b.effectiveX);

  if (hands.length >= 2) {
    const leftHand = hands[0];
    const rightHand = hands[1];

    // Left Hand Controls: Grow height + Foliage density + Wind dance
    targetStemHeight = leftHand.thumbIndexSpread;
    targetFoliage = leftHand.otherFingersSpread;
    targetWind = leftHand.pinkyLift;

    // Right Hand Controls: Bloom opening + Petal flare/Glow + Sparkle/Pollen burst
    targetBloom = rightHand.thumbIndexSpread;
    targetSparkle = Math.max(rightHand.otherFingersSpread, rightHand.pinkyLift);

    leftHand.role = "left";
    rightHand.role = "right";
    activeHandsData = [leftHand, rightHand];
  } else if (hands.length === 1) {
    const singleHand = hands[0];
    if (singleHand.effectiveX < 0.5) {
      targetStemHeight = singleHand.thumbIndexSpread;
      targetFoliage = singleHand.otherFingersSpread;
      targetWind = singleHand.pinkyLift;
      singleHand.role = "left";
    } else {
      targetBloom = singleHand.thumbIndexSpread;
      targetSparkle = Math.max(singleHand.otherFingersSpread, singleHand.pinkyLift);
      singleHand.role = "right";
    }
    activeHandsData = [singleHand];
  }

  // Audio resonance on growth change
  if (Math.abs(targetStemHeight - currentStemHeight) > 0.08) {
    const pitchIdx = Math.floor(currentStemHeight * 9);
    playBotanicalChime(pitchIdx, 0.12);
  }
}

// =========================================================================
// 5. ADVANCED PROCEDURAL BOTANICAL ENGINE (MULTI-BLOSSOM CLUSTERS)
// =========================================================================
function initParticles() {
  particles = [];
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.002,
      vy: -0.001 - Math.random() * 0.003,
      size: 1.5 + Math.random() * 3.5,
      alpha: 0.15 + Math.random() * 0.75,
      orbitAngle: Math.random() * Math.PI * 2,
      orbitSpeed: (Math.random() - 0.5) * 0.03,
    });
  }
}

function spawnBurst(x, y, count = 14, color = "#fde047") {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 5.0;
    burstParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 4.5,
      alpha: 1.0,
      decay: 0.02 + Math.random() * 0.03,
      color,
    });
  }
}

function updateAndDrawParticles(ctx, w, h, flowerX, flowerY, species, bloom, sparkle) {
  ctx.save();

  for (const p of particles) {
    p.y += p.vy;
    p.x += p.vx + Math.sin(windPhase + p.y * 6) * 0.0012;
    p.orbitAngle += p.orbitSpeed;

    if (p.y < -0.05) {
      p.y = 1.05;
      p.x = Math.random();
    }
    if (p.x < -0.05) p.x = 1.05;
    if (p.x > 1.05) p.x = -0.05;

    // Attraction field to the flower head
    if (bloom > 0.3) {
      const dx = flowerX / w - p.x;
      const dy = flowerY / h - p.y;
      const d = Math.hypot(dx, dy);
      if (d < 0.4 && d > 0.02) {
        p.x += (dx / d) * 0.0008;
        p.y += (dy / d) * 0.0008;
      }
    }

    const px = p.x * w;
    const py = p.y * h;
    const alpha = p.alpha * (0.25 + bloom * 0.55 + sparkle * 0.45);

    ctx.beginPath();
    ctx.arc(px, py, p.size * (1 + sparkle * 0.6), 0, 2 * Math.PI);
    ctx.fillStyle = species.colors.glow.replace(/[\d.]+\)$/, `${alpha})`);
    ctx.shadowColor = species.colors.petalInner;
    ctx.shadowBlur = 10;
    ctx.fill();
  }

  for (let i = burstParticles.length - 1; i >= 0; i--) {
    const bp = burstParticles[i];
    bp.x += bp.vx;
    bp.y += bp.vy;
    bp.vy += 0.04;
    bp.alpha -= bp.decay;

    if (bp.alpha <= 0) {
      burstParticles.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.arc(bp.x, bp.y, bp.size, 0, 2 * Math.PI);
    ctx.fillStyle = bp.color;
    ctx.shadowColor = bp.color;
    ctx.shadowBlur = 8;
    ctx.fill();
  }

  ctx.restore();
}

function drawStemAndLeaves(ctx, rootX, rootY, flowerX, flowerY, grow, foliage, wind, species, midX, midY) {
  ctx.save();
  ctx.lineWidth = 12 + (1 - grow) * 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const stemGrad = ctx.createLinearGradient(rootX, rootY, flowerX, flowerY);
  stemGrad.addColorStop(0, "#064e3b");
  stemGrad.addColorStop(0.5, species.colors.stem);
  stemGrad.addColorStop(1, species.colors.leaf);

  ctx.strokeStyle = stemGrad;
  ctx.shadowColor = "rgba(16, 185, 129, 0.5)";
  ctx.shadowBlur = 10;

  // Main Stalk
  ctx.beginPath();
  ctx.moveTo(rootX, rootY);
  ctx.quadraticCurveTo(midX, midY, flowerX, flowerY);
  ctx.stroke();

  // Draw foliage leaves along the stem
  const baseLeaves = Math.floor(2 + grow * 5 + foliage * 5);
  for (let i = 1; i <= baseLeaves; i++) {
    const t = i / (baseLeaves + 1);
    if (t > grow + 0.12) continue;

    const lx = (1 - t) * (1 - t) * rootX + 2 * (1 - t) * t * midX + t * t * flowerX;
    const ly = (1 - t) * (1 - t) * rootY + 2 * (1 - t) * t * midY + t * t * flowerY;

    const side = i % 2 === 0 ? 1 : -1;
    const leafLength = (26 + grow * 30 + foliage * 25) * Math.min(1, grow * 1.6);
    const leafWidth = leafLength * 0.48;
    const leafAngle = (side * Math.PI) / 3.2 + Math.sin(windPhase + i) * 0.18;

    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(leafAngle);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(leafWidth, -leafWidth, leafLength - leafWidth, -leafWidth * 0.5, leafLength, 0);
    ctx.bezierCurveTo(leafWidth * 0.5, leafWidth, leafWidth * 0.5, leafWidth, 0, 0);

    const leafGrad = ctx.createLinearGradient(0, 0, leafLength, 0);
    leafGrad.addColorStop(0, species.colors.stem);
    leafGrad.addColorStop(0.7, species.colors.leaf);
    leafGrad.addColorStop(1, "#6ee7b7");

    ctx.fillStyle = leafGrad;
    ctx.shadowBlur = 6;
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(leafLength * 0.85, 0);
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

function drawLilyPetal(ctx, length, width, bloom, species, isOuterSepal = false) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);

  // Wavy recurved outer contour
  ctx.bezierCurveTo(-width * 0.75, -length * 0.25, -width * 1.05, -length * 0.65, -width * 0.45, -length * 0.95);
  ctx.bezierCurveTo(-width * 0.15, -length * 1.08, width * 0.15, -length * 1.08, width * 0.45, -length * 0.95);
  ctx.bezierCurveTo(width * 1.05, -length * 0.65, width * 0.75, -length * 0.25, 0, 0);
  ctx.closePath();

  const grad = ctx.createRadialGradient(0, -length * 0.2, 3, 0, -length * 0.55, length * 1.1);
  grad.addColorStop(0.0, "#bef264");
  grad.addColorStop(0.18, "#d9f99d");
  grad.addColorStop(0.35, "#ffffff");
  grad.addColorStop(0.65, "#fbcfe8");
  grad.addColorStop(0.92, "#f472b6");
  grad.addColorStop(1.0, "#e11d48");

  ctx.fillStyle = grad;
  ctx.shadowColor = "rgba(244, 114, 182, 0.35)";
  ctx.shadowBlur = 10;
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Midrib ridge
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(0, -length * 0.5, 0, -length * 0.98);
  ctx.strokeStyle = "rgba(101, 163, 13, 0.4)";
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Papillae Nectar Freckles
  const speckleCount = isOuterSepal ? 6 : 10;
  ctx.fillStyle = "#881337";
  for (let s = 1; s <= speckleCount; s++) {
    const sy = -length * (0.18 + (s / speckleCount) * 0.45);
    const side = (s % 2 === 0 ? 1 : -1) * (1 + (s % 3) * 0.4);
    const sx = side * (width * 0.18);
    const rad = 1.1 + (s % 3) * 0.5;

    ctx.beginPath();
    ctx.arc(sx, sy, rad, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.restore();
}

function drawGenericPetal(ctx, length, width, bloom, species, layerIndex) {
  ctx.beginPath();
  const type = species.petalType;

  if (type === "lotus") {
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-width * 0.8, -length * 0.4, -width, -length * 0.8, 0, -length);
    ctx.bezierCurveTo(width, -length * 0.8, width * 0.8, -length * 0.4, 0, 0);
  } else if (type === "rose") {
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-width * 1.2, -length * 0.3, -width * 1.1, -length * 0.9, 0, -length);
    ctx.bezierCurveTo(width * 1.1, -length * 0.9, width * 1.2, -length * 0.3, 0, 0);
  } else if (type === "sunflower") {
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-width * 0.5, -length * 0.5, -width * 0.3, -length * 0.9, 0, -length);
    ctx.bezierCurveTo(width * 0.3, -length * 0.9, width * 0.5, -length * 0.5, 0, 0);
  } else if (type === "sakura") {
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-width, -length * 0.5, -width * 0.8, -length * 0.95, -width * 0.2, -length);
    ctx.lineTo(0, -length * 0.88);
    ctx.lineTo(width * 0.2, -length);
    ctx.bezierCurveTo(width * 0.8, -length * 0.95, width, -length * 0.5, 0, 0);
  } else {
    // Cosmic orchid
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-width * 1.3, -length * 0.3, -width * 0.4, -length * 0.8, 0, -length);
    ctx.bezierCurveTo(width * 0.4, -length * 0.8, width * 1.3, -length * 0.3, 0, 0);
  }

  const grad = ctx.createRadialGradient(0, -length * 0.4, 2, 0, -length * 0.5, length);
  grad.addColorStop(0, species.colors.petalInner);
  grad.addColorStop(0.6, species.colors.petalOuter);
  grad.addColorStop(1, species.colors.petalBase);

  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawFlowerHead(ctx, cx, cy, bloom, grow, sparkle, species, customScale = 1.0, rotation = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  if (rotation !== 0) ctx.rotate(rotation);

  const scale = (0.4 + grow * 0.65) * customScale;
  ctx.scale(scale, scale);

  // Glow Aura
  if (bloom > 0.25) {
    const auraRad = (85 + bloom * 105 + sparkle * 40) * customScale;
    const auraGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, auraRad);
    auraGrad.addColorStop(0, species.colors.glow);
    auraGrad.addColorStop(1, "transparent");
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, auraRad, 0, 2 * Math.PI);
    ctx.fill();
  }

  const layers = species.petalLayers;
  const totalPetals = species.petalCount;
  const maxPetalLength = (species.petalType === "lily" ? 85 : 70) + bloom * (species.petalType === "lily" ? 75 : 65);
  const maxPetalWidth = (species.petalType === "lily" ? 32 : 26) + bloom * (species.petalType === "lily" ? 34 : 30);

  if (species.petalType === "lily") {
    // 3 outer sepals behind
    const outerBloom = Math.min(1, Math.max(0.1, bloom * 1.15));
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3 + Math.PI / 6;
      ctx.save();
      ctx.rotate(angle);
      const unfoldTilt = 0.25 + outerBloom * 0.75;
      ctx.scale(unfoldTilt, unfoldTilt);
      drawLilyPetal(ctx, maxPetalLength * 0.95, maxPetalWidth * 0.85, outerBloom, species, true);
      ctx.restore();
    }
    // 3 inner broad petals in front
    const innerBloom = Math.min(1, Math.max(0.08, bloom * 1.3));
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3 - Math.PI / 6;
      ctx.save();
      ctx.rotate(angle);
      const unfoldTilt = 0.28 + innerBloom * 0.72;
      ctx.scale(unfoldTilt, unfoldTilt);
      drawLilyPetal(ctx, maxPetalLength, maxPetalWidth, innerBloom, species, false);
      ctx.restore();
    }
  } else {
    for (let l = 0; l < layers; l++) {
      const layerRatio = (l + 1) / layers;
      const petalsInLayer = Math.round(totalPetals / layers);
      const layerBloom = Math.min(1, Math.max(0.05, bloom * 1.2 - (1 - layerRatio) * 0.35));
      const pLength = maxPetalLength * (0.65 + layerRatio * 0.35);
      const pWidth = maxPetalWidth * (0.65 + layerRatio * 0.35);
      const layerAngleOffset = (l * Math.PI) / petalsInLayer;

      for (let p = 0; p < petalsInLayer; p++) {
        const angle = (p * 2 * Math.PI) / petalsInLayer + layerAngleOffset;
        ctx.save();
        ctx.rotate(angle);
        const unfoldTilt = 0.2 + layerBloom * 0.8;
        ctx.scale(unfoldTilt, unfoldTilt);
        drawGenericPetal(ctx, pLength, pWidth, layerBloom, species, l);
        ctx.restore();
      }
    }
  }

  // Stamens & Pistils
  if (species.petalType === "lily") {
    // Throat disc
    const throatGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 16);
    throatGrad.addColorStop(0, "#65a30d");
    throatGrad.addColorStop(0.7, "#bef264");
    throatGrad.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, 2 * Math.PI);
    ctx.fillStyle = throatGrad;
    ctx.fill();

    const stamenLength = 48 + bloom * 44;
    for (let s = 0; s < 6; s++) {
      const sAngle = (s * Math.PI * 2) / 6 + Math.PI / 12;
      ctx.save();
      ctx.rotate(sAngle);
      ctx.strokeStyle = "#d9f99d";
      ctx.lineWidth = 3.0;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(12 * bloom, -stamenLength * 0.55, 18 * bloom, -stamenLength);
      ctx.stroke();

    ctx.fill();
  } else {
    const centerRadius = 18 + bloom * 20;
    const centerGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, centerRadius);
    centerGrad.addColorStop(0, species.colors.center);
    centerGrad.addColorStop(0.8, species.colors.petalBase);
    centerGrad.addColorStop(1, "#334155");

    ctx.beginPath();
    ctx.arc(0, 0, centerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = centerGrad;
    ctx.shadowColor = species.colors.center;
    ctx.shadowBlur = 14;
    ctx.fill();

    const stamenCount = Math.floor(12 + bloom * 26);
    ctx.fillStyle = "#fef08a";
    for (let s = 0; s < stamenCount; s++) {
      const sa = s * 2.39996;
      const sr = Math.sqrt(s / stamenCount) * (centerRadius * 0.85);
      ctx.beginPath();
      ctx.arc(Math.cos(sa) * sr, Math.sin(sa) * sr, 2.0, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawBranchBlossom(ctx, startX, startY, endX, endY, bloom, grow, sparkle, species, scale, rotation) {
  ctx.save();
  ctx.lineWidth = 7;
  ctx.lineCap = "round";

  const branchGrad = ctx.createLinearGradient(startX, startY, endX, endY);
  branchGrad.addColorStop(0, species.colors.stem);
  branchGrad.addColorStop(1, species.colors.leaf);
  ctx.strokeStyle = branchGrad;

  // Curving side branch
  const midX = (startX + endX) / 2 + Math.sin(windPhase) * 6;
  const midY = (startY + endY) / 2 + 10;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo(midX, midY, endX, endY);
  ctx.stroke();

  // Draw blossom at branch tip
  drawFlowerHead(ctx, endX, endY, bloom, grow, sparkle, species, scale, rotation);
  ctx.restore();
}

function renderFlowerCanvas() {
  if (!flowerCtx || !flowerCanvas) return;

  const w = flowerCanvas.width;
  const h = flowerCanvas.height;

  flowerCtx.clearRect(0, 0, w, h);

  // Smooth lerp values
  currentStemHeight = lerp(currentStemHeight, targetStemHeight, 0.12);
  currentFoliage = lerp(currentFoliage, targetFoliage, 0.12);
  currentBloom = lerp(currentBloom, targetBloom, 0.12);
  currentSparkle = lerp(currentSparkle, targetSparkle, 0.12);
  currentWind = lerp(currentWind, targetWind, 0.12);

  // Smooth Hand Position Tracking (Lerp)
  currentHandX = lerp(currentHandX, targetHandX, 0.08);
  currentHandY = lerp(currentHandY, targetHandY, 0.08);

  windPhase += 0.025 + currentWind * 0.035;

  const species = FLOWER_SPECIES[currentSpeciesIndex];

  // Update HUD text & bar gauges
  const growPercent = Math.round(((currentStemHeight + currentFoliage) / 2) * 100);
  const bloomPercent = Math.round(((currentBloom + currentSparkle) / 2) * 100);

  if (growBar) growBar.style.width = `${growPercent}%`;
  if (bloomBar) bloomBar.style.width = `${bloomPercent}%`;
  if (growValueText) growValueText.textContent = `${growPercent}%`;
  if (bloomValueText) bloomValueText.textContent = `${bloomPercent}%`;
  if (stemValueText) stemValueText.textContent = `${Math.round(currentStemHeight * 100)}%`;
  if (foliageValueText) foliageValueText.textContent = `${Math.round(currentFoliage * 100)}%`;
  if (petalValueText) petalValueText.textContent = `${Math.round(currentBloom * 100)}%`;
  if (sparkleValueText) sparkleValueText.textContent = `${Math.round(currentSparkle * 100)}%`;

  // Root & Dynamic Following Coordinates
  const rootX = w * 0.5 + (currentHandX - 0.5) * w * 0.22;
  const rootY = h * 0.96;
  const minStemHeight = h * 0.16;
  const maxStemHeight = h * 0.68;
  const stemHeightPx = minStemHeight + currentStemHeight * (maxStemHeight - minStemHeight);

  // Stalk reaches out dynamically towards the user's hand!
  const handOffsetReachX = (currentHandX - 0.5) * w * 0.55;
  const handOffsetReachY = (currentHandY - 0.5) * h * 0.22;

  const flowerX = w * 0.5 + handOffsetReachX + Math.sin(windPhase) * (14 * currentStemHeight + currentWind * 20);
  const flowerY = rootY - stemHeightPx + handOffsetReachY;

  const swayOffset = Math.sin(windPhase) * (18 * currentStemHeight + currentWind * 25);
  const midX = (rootX + flowerX) / 2 + swayOffset;
  const midY = (rootY + flowerY) / 2;

  // Trigger sparkle bursts on high sparkle
  if (currentSparkle > 0.65 && Math.random() < 0.25) {
    spawnBurst(flowerX, flowerY, 6, species.colors.glow);
  }

  // 1. Draw Pollen & Embers
  updateAndDrawParticles(flowerCtx, w, h, flowerX, flowerY, species, currentBloom, currentSparkle);

  // 2. Draw Main Stalk and Leaves
  drawStemAndLeaves(flowerCtx, rootX, rootY, flowerX, flowerY, currentStemHeight, currentFoliage, currentWind, species, midX, midY);

  // 3. Draw Side Branches with Extra Lily/Cluster Blossoms (Multi-flower Bouquet)
  if (species.clusterBranches && currentStemHeight > 0.25) {
    // Left Branch Blossom
    const tLeft = 0.68;
    const b1StartX = (1 - tLeft) * (1 - tLeft) * rootX + 2 * (1 - tLeft) * tLeft * midX + tLeft * tLeft * flowerX;
    const b1StartY = (1 - tLeft) * (1 - tLeft) * rootY + 2 * (1 - tLeft) * tLeft * midY + tLeft * tLeft * flowerY;
    const b1EndX = b1StartX - (65 + currentFoliage * 45) * Math.min(1, currentStemHeight * 1.5);
    const b1EndY = b1StartY - (35 + currentStemHeight * 20);

    drawBranchBlossom(flowerCtx, b1StartX, b1StartY, b1EndX, b1EndY, currentBloom, currentStemHeight, currentSparkle, species, 0.72, -0.35);

    // Right Branch Blossom
    const tRight = 0.78;
    const b2StartX = (1 - tRight) * (1 - tRight) * rootX + 2 * (1 - tRight) * tRight * midX + tRight * tRight * flowerX;
    const b2StartY = (1 - tRight) * (1 - tRight) * rootY + 2 * (1 - tRight) * tRight * midY + tRight * tRight * flowerY;
    const b2EndX = b2StartX + (70 + currentFoliage * 45) * Math.min(1, currentStemHeight * 1.5);
    const b2EndY = b2StartY - (40 + currentStemHeight * 20);

    drawBranchBlossom(flowerCtx, b2StartX, b2StartY, b2EndX, b2EndY, currentBloom, currentStemHeight, currentSparkle, species, 0.76, 0.38);

    // Lower Flower Bud (Emerging third flower)
    if (currentFoliage > 0.4) {
      const tBud = 0.50;
      const b3StartX = (1 - tBud) * (1 - tBud) * rootX + 2 * (1 - tBud) * tBud * midX + tBud * tBud * flowerX;
      const b3StartY = (1 - tBud) * (1 - tBud) * rootY + 2 * (1 - tBud) * tBud * midY + tBud * tBud * flowerY;
      const b3EndX = b3StartX - 50 * currentFoliage;
      const b3EndY = b3StartY - 25;

      drawBranchBlossom(flowerCtx, b3StartX, b3StartY, b3EndX, b3EndY, currentBloom * 0.8, currentStemHeight, currentSparkle, species, 0.55, -0.45);
    }
  }

  // 4. Draw Main Central Crowning Flower Blossom
  drawFlowerHead(flowerCtx, flowerX, flowerY, currentBloom, currentStemHeight, currentSparkle, species, 1.0, 0);
}

// =========================================================================
// 6. CAMERA OVERLAY DRAWING (MULTI-FINGER CONSTELLATION)
// =========================================================================
const HAND_SKELETON_BONES = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
];

function drawCameraOverlays() {
  if (!overlayCtx || !overlayCanvas) return;

  if (overlayCanvas.width !== video.videoWidth || overlayCanvas.height !== video.videoHeight) {
    overlayCanvas.width = video.videoWidth || 640;
    overlayCanvas.height = video.videoHeight || 480;
  }

  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  if (!showSkeleton) return;

  const w = overlayCanvas.width;
  const h = overlayCanvas.height;

  for (const hand of activeHandsData) {
    const isLeft = hand.role === "left";
    const primaryColor = isLeft ? "#34d399" : "#f472b6";
    const secondaryColor = isLeft ? "#6ee7b7" : "#fbcfe8";

    overlayCtx.save();

    // 1. Draw glowing bones
    overlayCtx.lineWidth = 3;
    overlayCtx.strokeStyle = isLeft ? "rgba(52, 211, 153, 0.6)" : "rgba(244, 114, 182, 0.6)";
    overlayCtx.shadowColor = primaryColor;
    overlayCtx.shadowBlur = 8;

    for (const [start, end] of HAND_SKELETON_BONES) {
      const p1 = hand.lm[start];
      const p2 = hand.lm[end];
      overlayCtx.beginPath();
      overlayCtx.moveTo(p1.x * w, p1.y * h);
      overlayCtx.lineTo(p2.x * w, p2.y * h);
      overlayCtx.stroke();
    }

    // 2. Draw Pinch Energy Arc
    const pThumb = hand.thumbTip;
    const pIndex = hand.indexTip;
    const pMid = hand.middleTip;
    const pPinky = hand.pinkyTip;

    overlayCtx.lineWidth = 5;
    overlayCtx.strokeStyle = primaryColor;
    overlayCtx.beginPath();
    overlayCtx.moveTo(pThumb.x * w, pThumb.y * h);
    overlayCtx.lineTo(pIndex.x * w, pIndex.y * h);
    overlayCtx.stroke();

    // 3. Draw Nodes with Labels
    const nodes = [
      { pt: pThumb, label: "👍", color: "#ffffff" },
      { pt: pIndex, label: isLeft ? "🌱 THÂN" : "🌸 NỞ", color: primaryColor },
      { pt: pMid, label: isLeft ? "🍃 LÁ" : "✨ HÀO QUANG", color: secondaryColor },
      { pt: pPinky, label: isLeft ? "💨 GIÓ" : "💫 PHẤN", color: "#fef08a" },
    ];

    for (const node of nodes) {
      const nx = node.pt.x * w;
      const ny = node.pt.y * h;

      overlayCtx.beginPath();
      overlayCtx.arc(nx, ny, 7, 0, 2 * Math.PI);
      overlayCtx.fillStyle = node.color;
      overlayCtx.shadowColor = node.color;
      overlayCtx.shadowBlur = 10;
      overlayCtx.fill();

      overlayCtx.font = "bold 11px -apple-system, sans-serif";
      overlayCtx.fillStyle = "#ffffff";
      overlayCtx.shadowColor = "#000000";
      overlayCtx.shadowBlur = 4;
      overlayCtx.textAlign = "center";
      overlayCtx.fillText(node.label, nx, ny - 12);
    }

    overlayCtx.restore();
  }
}

// =========================================================================
// 7. SNAPSHOT GENERATOR (📸)
// =========================================================================
async function takeSnapshot() {
  playShutterSound();

  flashOverlay.classList.add("flashing");
  setTimeout(() => flashOverlay.classList.remove("flashing"), 120);

  const offCanvas = document.createElement("canvas");
  const offCtx = offCanvas.getContext("2d");

  offCanvas.width = 1280;
  offCanvas.height = 720;

  offCtx.fillStyle = "#07090e";
  offCtx.fillRect(0, 0, 1280, 720);

  // Draw Camera Feed
  offCtx.save();
  if (isMirrored) {
    offCtx.translate(640, 0);
    offCtx.scale(-1, 1);
    offCtx.drawImage(video, 0, 0, 640, 720);
  } else {
    offCtx.drawImage(video, 0, 0, 640, 720);
  }
  offCtx.restore();

  if (showSkeleton && overlayCanvas) {
    offCtx.save();
    if (isMirrored) {
      offCtx.translate(640, 0);
      offCtx.scale(-1, 1);
    }
    offCtx.drawImage(overlayCanvas, 0, 0, 640, 720);
    offCtx.restore();
  }

  // Draw Botanical Canvas
  if (flowerCanvas) {
    offCtx.drawImage(flowerCanvas, 640, 0, 640, 720);
  }

  // Title Badge
  offCtx.fillStyle = "rgba(15, 23, 42, 0.88)";
  offCtx.roundRect ? offCtx.roundRect(24, 24, 520, 58, 24) : offCtx.fillRect(24, 24, 520, 58);
  offCtx.fill();

  offCtx.fillStyle = "#fbcfe8";
  offCtx.font = "bold 22px 'Plus Jakarta Sans', sans-serif";
  const species = FLOWER_SPECIES[currentSpeciesIndex];
  offCtx.fillText(`${species.icon} Flora Bloom - ${species.name}`, 48, 60);

  const dataUrl = offCanvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `flora_bloom_${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToast("📸 Đã lưu tác phẩm hoa vào thư viện!");
}

// =========================================================================
// 8. CAMERA & RESIZE HANDLING
// =========================================================================
async function startCamera(facing = currentFacingMode) {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Trình duyệt không hỗ trợ Camera. Hãy chắc chắn truy cập bằng HTTPS!");
  }

  const constraints = {
    video: {
      facingMode: facing,
      width: { ideal: 640 },
      height: { ideal: 480 },
    },
    audio: false,
  };

  currentStream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = currentStream;
  await video.play();

  currentFacingMode = facing;
  isMirrored = facing === "user";
  updateMirrorState();
}

function updateMirrorState() {
  if (isMirrored) {
    video.classList.remove("unmirrored");
    if (overlayCanvas) overlayCanvas.classList.remove("unmirrored");
    btnMirror.classList.add("active");
  } else {
    video.classList.add("unmirrored");
    if (overlayCanvas) overlayCanvas.classList.add("unmirrored");
    btnMirror.classList.remove("active");
  }
}

function resizeFlowerCanvas() {
  if (!flowerCanvas || !flowerPane) return;
  const rect = flowerPane.getBoundingClientRect();
  flowerCanvas.width = rect.width || 600;
  flowerCanvas.height = rect.height || 600;
}

// =========================================================================
// 9. SPECIES DRAWER & LAYOUT CONTROL
// =========================================================================
function buildSpeciesDrawer() {
  if (!speciesGrid) return;
  speciesGrid.innerHTML = "";

  FLOWER_SPECIES.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = `species-card ${idx === currentSpeciesIndex ? "selected" : ""}`;
    card.innerHTML = `
      <div class="species-card-icon">${item.icon}</div>
      <div class="species-card-title">${item.name}</div>
      <div class="species-card-desc">${item.desc}</div>
    `;

    card.addEventListener("click", () => {
      currentSpeciesIndex = idx;
      updateActiveSpecies();
      speciesDrawer.classList.add("hidden");
      showToast(`Đã chọn: ${item.icon} ${item.name}`);
    });

    speciesGrid.appendChild(card);
  });
}

function updateActiveSpecies() {
  const item = FLOWER_SPECIES[currentSpeciesIndex];
  if (speciesBadgeIcon) speciesBadgeIcon.textContent = item.icon;
  if (speciesBadgeName) speciesBadgeName.textContent = item.name;
  buildSpeciesDrawer();
}

function applyLayout() {
  const layout = LAYOUT_MODES[currentLayoutIndex];
  let classes = ["app-container", layout.id];
  if (isSwapped) classes.push("is-swapped");
  appContainer.className = classes.join(" ");
  resizeFlowerCanvas();
}

function toggleFullscreen() {
  const doc = document;
  const elem = doc.documentElement;
  const isFull = !!(doc.fullscreenElement || doc.webkitFullscreenElement);

  if (!isFull) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
    if (btnFullscreen) btnFullscreen.classList.add("active");
    showToast("⛶ Toàn màn hình");
  } else {
    if (doc.exitFullscreen) {
      doc.exitFullscreen().catch(() => {});
    }
    if (btnFullscreen) btnFullscreen.classList.remove("active");
    showToast("Thu nhỏ màn hình");
  }
}

// =========================================================================
// 10. MAIN LOOP
// =========================================================================
function loop() {
  if (!isRunning) return;

  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    const ts = performance.now();

    const handResult = handLandmarker.detectForVideo(video, ts);
    processHandGestures(handResult);
    drawCameraOverlays();
  }

  renderFlowerCanvas();
  requestAnimationFrame(loop);
}

// =========================================================================
// 11. INITIALIZATION & EVENT LISTENERS
// =========================================================================
async function init() {
  initParticles();
  buildSpeciesDrawer();
  updateActiveSpecies();
  window.addEventListener("resize", resizeFlowerCanvas);
  resizeFlowerCanvas();

  try {
    overlayTitle.textContent = "Đang tải mô hình AI...";
    overlayDesc.textContent = "MediaPipe Vision Models đang được nạp...";

    const fileset = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );

    overlayDesc.textContent = "Đang khởi tạo Hand Tracking Engine...";

    handLandmarker = await HandLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
    });

    overlayTitle.textContent = "Flora Bloom Đã Sẵn Sàng!";
    overlayDesc.textContent = "Nhấn nút bên dưới để cấp quyền camera và bắt đầu điều khiển hoa nở.";
    spinner.style.display = "none";
    startBtn.style.display = "inline-block";

    startCamera("user")
      .then(() => {
        loadingOverlay.classList.add("hidden");
        isRunning = true;
        initAudio();
        resizeFlowerCanvas();
        requestAnimationFrame(loop);
      })
      .catch((err) => {
        console.warn("User interaction required:", err);
      });
  } catch (err) {
    console.error("Init error:", err);
    spinner.style.display = "none";
    overlayTitle.textContent = "Có lỗi xảy ra";
    overlayDesc.textContent = "Không thể tải mô hình hoặc kết nối camera.";
    errorBanner.style.display = "block";
    errorBanner.innerText = err.message || String(err);
  }
}

startBtn.addEventListener("click", async () => {
  try {
    initAudio();
    errorBanner.style.display = "none";
    await startCamera(currentFacingMode);
    loadingOverlay.classList.add("hidden");
    isRunning = true;
    resizeFlowerCanvas();
    requestAnimationFrame(loop);
  } catch (err) {
    console.error(err);
    errorBanner.style.display = "block";
    errorBanner.innerText = err.message || String(err);
  }
});

btnSpecies.addEventListener("click", () => {
  speciesDrawer.classList.remove("hidden");
});
speciesBadge.addEventListener("click", () => {
  speciesDrawer.classList.remove("hidden");
});
btnCloseDrawer.addEventListener("click", () => {
  speciesDrawer.classList.add("hidden");
});
speciesDrawer.addEventListener("click", (e) => {
  if (e.target === speciesDrawer) {
    speciesDrawer.classList.add("hidden");
  }
});

btnLayout.addEventListener("click", () => {
  currentLayoutIndex = (currentLayoutIndex + 1) % LAYOUT_MODES.length;
  applyLayout();
  showToast(`🪟 Bố cục: ${LAYOUT_MODES[currentLayoutIndex].name}`);
});

btnSwap.addEventListener("click", () => {
  isSwapped = !isSwapped;
  applyLayout();
  showToast(isSwapped ? "🔁 Đã đổi vị trí (Hoa ⇄ Cam)" : "🔁 Vị trí mặc định (Cam ⇄ Hoa)");
});

btnSwitchCam.addEventListener("click", async () => {
  const targetMode = currentFacingMode === "user" ? "environment" : "user";
  try {
    await startCamera(targetMode);
    showToast(targetMode === "user" ? "📷 Camera trước" : "📸 Camera sau");
  } catch (err) {
    alert("Không thể chuyển camera: " + err.message);
  }
});

btnSnapshot.addEventListener("click", () => {
  takeSnapshot();
});

btnSound.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    btnSound.classList.add("active");
    btnSound.textContent = "🔊 Âm thanh";
    playBotanicalChime(4, 0.2);
    showToast("Đã bật âm thanh thiên nhiên 🔊");
  } else {
    btnSound.classList.remove("active");
    btnSound.textContent = "🔇 Tắt tiếng";
    showToast("Đã tắt âm thanh 🔇");
  }
});

btnFullscreen.addEventListener("click", toggleFullscreen);

btnMirror.addEventListener("click", () => {
  isMirrored = !isMirrored;
  updateMirrorState();
});

btnSkeleton.addEventListener("click", () => {
  showSkeleton = !showSkeleton;
  if (showSkeleton) {
    btnSkeleton.classList.add("active");
  } else {
    btnSkeleton.classList.remove("active");
    if (overlayCtx && overlayCanvas) overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  }
});

init();
