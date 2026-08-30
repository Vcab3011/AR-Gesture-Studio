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
      petalOuter: "#f472b6", petalInner: "#ffffff", petalBase: "#fef08a",
      center: "#b45309", stem: "#047857", leaf: "#10b981",
      glow: "rgba(253, 230, 138, 0.6)", shimmer: "rgba(255,255,255,0.7)",
    },
    petalCount: 6, petalLayers: 2, petalType: "lily", clusterBranches: true,
  },
  {
    id: "lotus",
    name: "Hoa Sen Thần Thoại (Lotus)",
    icon: "🪷",
    desc: "Cánh hồng phớt thanh tao, nhụy vàng tỏa sáng, giọt sương mai",
    colors: {
      petalOuter: "#ec4899", petalInner: "#fbcfe8", petalBase: "#ffffff",
      center: "#f59e0b", stem: "#059669", leaf: "#10b981",
      glow: "rgba(236, 72, 153, 0.5)", shimmer: "rgba(255,200,230,0.65)",
    },
    petalCount: 18, petalLayers: 3, petalType: "lotus", clusterBranches: true,
  },
  {
    id: "rose",
    name: "Hoa Hồng Nhung (Velvet Rose)",
    icon: "🌹",
    desc: "Cánh đỏ thắm xoắn ốc quý phái, kiêu sa và huyền bí",
    colors: {
      petalOuter: "#be123c", petalInner: "#f43f5e", petalBase: "#881337",
      center: "#fbbf24", stem: "#047857", leaf: "#059669",
      glow: "rgba(244, 63, 94, 0.5)", shimmer: "rgba(255,150,170,0.55)",
    },
    petalCount: 24, petalLayers: 4, petalType: "rose", clusterBranches: true,
  },
  {
    id: "sunflower",
    name: "Hoa Hướng Dương (Sunflower)",
    icon: "🌻",
    desc: "Cánh vàng rực rỡ hướng về ánh dương với đĩa nhụy Fibonacci",
    colors: {
      petalOuter: "#f59e0b", petalInner: "#fde047", petalBase: "#d97706",
      center: "#451a03", stem: "#15803d", leaf: "#22c55e",
      glow: "rgba(245, 158, 11, 0.55)", shimmer: "rgba(255,240,130,0.6)",
    },
    petalCount: 26, petalLayers: 2, petalType: "sunflower", clusterBranches: false,
  },
  {
    id: "sakura",
    name: "Hoa Anh Đào (Sakura)",
    icon: "🌸",
    desc: "Cụm hoa đào phớt hồng rực rỡ bay trong gió xuân lãng mạn",
    colors: {
      petalOuter: "#f472b6", petalInner: "#fdf2f8", petalBase: "#fbcfe8",
      center: "#e11d48", stem: "#78350f", leaf: "#84cc16",
      glow: "rgba(244, 114, 182, 0.45)", shimmer: "rgba(255,220,235,0.7)",
    },
    petalCount: 10, petalLayers: 2, petalType: "sakura", clusterBranches: true,
  },
  {
    id: "cosmic",
    name: "Lan Dạ Quang (Cosmic Orchid)",
    icon: "🌌",
    desc: "Bioluminescent phát sáng dạ quang kỳ ảo với bụi sao ngân hà",
    colors: {
      petalOuter: "#06b6d4", petalInner: "#a855f7", petalBase: "#3b82f6",
      center: "#f0abfc", stem: "#0284c7", leaf: "#06b6d4",
      glow: "rgba(6, 182, 212, 0.75)", shimmer: "rgba(160,100,255,0.55)",
    },
    petalCount: 14, petalLayers: 3, petalType: "cosmic", clusterBranches: true,
  },
];

let currentSpeciesIndex = 0;

// =========================================================================
// 2. DOM ELEMENTS & STATE
// =========================================================================
const appContainer = document.getElementById("appContainer");
const cameraPane  = document.getElementById("cameraPane");
const flowerPane  = document.getElementById("flowerPane");
const video       = document.getElementById("video");
const overlayCanvas = document.getElementById("overlayCanvas");
const overlayCtx    = overlayCanvas ? overlayCanvas.getContext("2d") : null;
const flowerCanvas  = document.getElementById("flowerCanvas");
const flowerCtx     = flowerCanvas  ? flowerCanvas.getContext("2d")  : null;

const growBar        = document.getElementById("growBar");
const bloomBar       = document.getElementById("bloomBar");
const growValueText  = document.getElementById("growValueText");
const bloomValueText = document.getElementById("bloomValueText");
const stemValueText  = document.getElementById("stemValueText");
const foliageValueText = document.getElementById("foliageValueText");
const petalValueText   = document.getElementById("petalValueText");
const sparkleValueText = document.getElementById("sparkleValueText");

const speciesBadge     = document.getElementById("speciesBadge");
const speciesBadgeIcon = document.getElementById("speciesBadgeIcon");
const speciesBadgeName = document.getElementById("speciesBadgeName");
const speciesDrawer    = document.getElementById("speciesDrawer");
const speciesGrid      = document.getElementById("speciesGrid");
const btnCloseDrawer   = document.getElementById("btnCloseDrawer");

const loadingOverlay = document.getElementById("loadingOverlay");
const spinner        = document.getElementById("spinner");
const overlayTitle   = document.getElementById("overlayTitle");
const overlayDesc    = document.getElementById("overlayDesc");
const startBtn       = document.getElementById("startBtn");
const errorBanner    = document.getElementById("errorBanner");
const flashOverlay   = document.getElementById("flashOverlay");
const toast          = document.getElementById("toast");

const btnSpecies    = document.getElementById("btnSpecies");
const btnLayout     = document.getElementById("btnLayout");
const btnSwap       = document.getElementById("btnSwap");
const btnSwitchCam  = document.getElementById("btnSwitchCam");
const btnSnapshot   = document.getElementById("btnSnapshot");
const btnSound      = document.getElementById("btnSound");
const btnFullscreen = document.getElementById("btnFullscreen");
const btnMirror     = document.getElementById("btnMirror");
const btnSkeleton   = document.getElementById("btnSkeleton");

// Layout modes
const LAYOUT_MODES = [
  { id: "layout-split",       name: "Song song (Chia đôi)" },
  { id: "layout-pip",         name: "Ô nhỏ góc (PiP)" },
  { id: "layout-flower-solo", name: "Chỉ hiện Hoa (Solo)" },
];
let currentLayoutIndex = 0;
let isSwapped = false;

// MediaPipe State
let handLandmarker    = null;
let currentStream     = null;
let currentFacingMode = "user";
let isMirrored   = true;
let showSkeleton = true;
let soundEnabled = true;
let isRunning    = false;
let lastVideoTime = -1;

// Animation targets & current values
let targetStemHeight = 0.35, targetFoliage = 0.35, targetBloom = 0.25, targetSparkle = 0.25, targetWind = 0.2;
let currentStemHeight= 0.35, currentFoliage= 0.35, currentBloom= 0.25, currentSparkle= 0.25, currentWind= 0.2;

// Hand tracking
let targetHandX = 0.5, targetHandY = 0.5;
let currentHandX= 0.5, currentHandY= 0.5;
let hasHandsInFrame = false;

// Global animation time
let windPhase  = 0;
let globalTime = 0;

// Particle systems
let particles = [], burstParticles = [], pollenParticles = [], petalFallParticles = [];
const MAX_PARTICLES = 120, MAX_POLLEN = 60, MAX_PETAL_FALL = 30;

// Active hand data
let activeHandsData = [];

// Per-petal micro-animation offsets (organic shimmer & flutter)
const PETAL_ANIM_OFFSETS = Array.from({ length: 64 }, () => ({
  wobble:       Math.random() * Math.PI * 2,
  wobbleSpeed:  0.4 + Math.random() * 0.8,
  shimmerPhase: Math.random() * Math.PI * 2,
  shimmerSpeed: 1.0 + Math.random() * 1.5,
  tiltWobble:   (Math.random() - 0.5) * 0.08,
}));

// =========================================================================
// 3. AUDIO SYNTHESIZER
// =========================================================================
let audioCtx = null;
const PENTATONIC_PITCHES = [261.63,293.66,329.63,392.0,440.0,523.25,587.33,659.25,783.99,880.0];

function initAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
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
    osc.type = "sine";
    osc.frequency.setValueAtTime(PENTATONIC_PITCHES[pitchIndex % PENTATONIC_PITCHES.length] || 440, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(now); osc.stop(now + 0.60);
  } catch (e) {}
}

function playShutterSound() {
  try {
    initAudio(); if (!audioCtx) return;
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = "triangle";
    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(now); osc.stop(now + 0.1);
  } catch (e) {}
}

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

// =========================================================================
// 4. HAND GESTURE PROCESSING
// =========================================================================
function dist(a, b) { return (!a || !b) ? 0 : Math.hypot(a.x-b.x, a.y-b.y); }
function lerp(s, e, f) { return s + (e - s) * f; }
function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

function processHandGestures(handResult) {
  activeHandsData = [];
  if (!handResult.landmarks || handResult.landmarks.length === 0) {
    hasHandsInFrame = false;
    targetHandX = 0.5; targetHandY = 0.5;
    return;
  }
  hasHandsInFrame = true;

  const hands = handResult.landmarks.map((lm) => {
    const wrist=lm[0], palm=lm[9], thumbTip=lm[4], indexTip=lm[8],
          middleTip=lm[12], ringTip=lm[16], pinkyTip=lm[20];
    const handScale = dist(wrist, palm) || 0.1;
    const thumbIndexSpread   = clamp((dist(thumbTip,indexTip)/handScale - 0.22)/0.88, 0, 1);
    const otherFingersSpread = clamp(((dist(indexTip,middleTip)+dist(middleTip,ringTip))/(2*handScale)-0.25)/0.70, 0, 1);
    const pinkyLift          = clamp(((dist(wrist,pinkyTip)-dist(wrist,lm[17]))/handScale-0.1)/0.8, 0, 1);
    const effectiveX = isMirrored ? (1 - palm.x) : palm.x;
    const effectiveY = palm.y;
    return { lm, wrist, palm, thumbTip, indexTip, middleTip, ringTip, pinkyTip,
             handScale, thumbIndexSpread, otherFingersSpread, pinkyLift, effectiveX, effectiveY };
  });

  targetHandX = hands.reduce((s,h) => s+h.effectiveX, 0) / hands.length;
  targetHandY = hands.reduce((s,h) => s+h.effectiveY, 0) / hands.length;
  hands.sort((a, b) => a.effectiveX - b.effectiveX);

  if (hands.length >= 2) {
    const [left, right] = hands;
    targetStemHeight = left.thumbIndexSpread;
    targetFoliage    = left.otherFingersSpread;
    targetWind       = left.pinkyLift;
    targetBloom      = right.thumbIndexSpread;
    targetSparkle    = Math.max(right.otherFingersSpread, right.pinkyLift);
    left.role = "left"; right.role = "right";
    activeHandsData = [left, right];
  } else if (hands.length === 1) {
    const h = hands[0];
    if (h.effectiveX < 0.5) {
      targetStemHeight = h.thumbIndexSpread; targetFoliage = h.otherFingersSpread; targetWind = h.pinkyLift;
      h.role = "left";
    } else {
      targetBloom = h.thumbIndexSpread; targetSparkle = Math.max(h.otherFingersSpread, h.pinkyLift);
      h.role = "right";
    }
    activeHandsData = [h];
  }

  if (Math.abs(targetStemHeight - currentStemHeight) > 0.08)
    playBotanicalChime(Math.floor(currentStemHeight * 9), 0.12);
}

// =========================================================================
// 5. PARTICLE SYSTEMS
// =========================================================================
function initParticles() {
  particles = Array.from({length: MAX_PARTICLES}, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random()-0.5)*0.002,
    vy: -0.001 - Math.random()*0.003,
    size: 1.5+Math.random()*3.5,
    alpha: 0.15+Math.random()*0.75,
    orbitAngle: Math.random()*Math.PI*2,
    orbitSpeed: (Math.random()-0.5)*0.03,
  }));
  pollenParticles = Array.from({length: MAX_POLLEN}, () => makePollen());
}

function makePollen() {
  return {
    x:0.5, y:0.4, vx:(Math.random()-0.5)*0.004,
    vy:-0.0005-Math.random()*0.003,
    size:1.2+Math.random()*2.5,
    alpha:0, targetAlpha:0.4+Math.random()*0.55,
    swayPhase:Math.random()*Math.PI*2,
    active:false, life:0, maxLife:120+Math.random()*160,
  };
}

function makePetalFall(fx, fy, species) {
  return {
    x:fx, y:fy,
    vx:(Math.random()-0.5)*2.5, vy:-1-Math.random()*2,
    rotation:Math.random()*Math.PI*2,
    rotSpeed:(Math.random()-0.5)*0.15,
    size:8+Math.random()*12,
    alpha:0.85, decay:0.005+Math.random()*0.008,
    petalColor:species.colors.petalOuter,
    innerColor:species.colors.petalInner,
    wobble:Math.random()*Math.PI*2,
    wobbleSpeed:0.04+Math.random()*0.06,
  };
}

function spawnBurst(x, y, count=14, color="#fde047") {
  for (let i=0; i<count; i++) {
    const angle = Math.random()*Math.PI*2, speed = 1.5+Math.random()*5;
    burstParticles.push({
      x, y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
      size:2+Math.random()*4.5, alpha:1.0, decay:0.02+Math.random()*0.03, color,
    });
  }
}

function updateAndDrawParticles(ctx, w, h, flowerX, flowerY, species, bloom, sparkle) {
  ctx.save();

  // Ambient orbs
  for (const p of particles) {
    p.y += p.vy; p.x += p.vx + Math.sin(windPhase + p.y*6)*0.0012; p.orbitAngle += p.orbitSpeed;
    if (p.y < -0.05) { p.y=1.05; p.x=Math.random(); }
    if (p.x < -0.05) p.x=1.05;
    if (p.x >  1.05) p.x=-0.05;
    if (bloom > 0.3) {
      const dx=flowerX/w-p.x, dy=flowerY/h-p.y, d=Math.hypot(dx,dy);
      if (d<0.4 && d>0.02) { p.x+=(dx/d)*0.0008; p.y+=(dy/d)*0.0008; }
    }
    const alpha = p.alpha*(0.2+bloom*0.5+sparkle*0.45);
    ctx.beginPath();
    ctx.arc(p.x*w, p.y*h, p.size*(1+sparkle*0.6), 0, 2*Math.PI);
    ctx.fillStyle = species.colors.glow.replace(/[\d.]+\)$/, `${alpha})`);
    ctx.shadowColor = species.colors.petalInner; ctx.shadowBlur=10;
    ctx.fill();
  }

  // Pollen drift
  if (bloom > 0.35) {
    for (const pp of pollenParticles) {
      if (!pp.active && Math.random() < 0.02*bloom) {
        pp.active=true; pp.x=flowerX/w+(Math.random()-0.5)*0.04;
        pp.y=flowerY/h+(Math.random()-0.5)*0.04;
        pp.vx=(Math.random()-0.5)*0.005; pp.vy=-0.001-Math.random()*0.004;
        pp.alpha=0; pp.life=0;
      }
      if (pp.active) {
        pp.life++;
        pp.alpha = Math.min(pp.targetAlpha, pp.alpha+0.02);
        if (pp.life > pp.maxLife*0.7) pp.alpha *= 0.97;
        pp.x += pp.vx + Math.sin(windPhase*1.3+pp.swayPhase)*0.0015; pp.y += pp.vy;
        if (pp.life >= pp.maxLife || pp.alpha < 0.02) { pp.active=false; pp.life=0; }
        ctx.beginPath(); ctx.arc(pp.x*w, pp.y*h, pp.size, 0, 2*Math.PI);
        ctx.fillStyle = `rgba(254,240,138,${pp.alpha})`;
        ctx.shadowColor="#fef08a"; ctx.shadowBlur=5; ctx.fill();
      }
    }
  }

  // Falling petals
  for (let i=petalFallParticles.length-1; i>=0; i--) {
    const pf = petalFallParticles[i];
    pf.wobble += pf.wobbleSpeed;
    pf.x += pf.vx + Math.sin(pf.wobble)*1.2 + Math.sin(windPhase*0.7)*0.8;
    pf.y += pf.vy; pf.vy += 0.12; pf.rotation += pf.rotSpeed; pf.alpha -= pf.decay;
    if (pf.alpha<=0 || pf.y > h+30) { petalFallParticles.splice(i,1); continue; }
    ctx.save(); ctx.globalAlpha=pf.alpha; ctx.translate(pf.x,pf.y); ctx.rotate(pf.rotation);
    ctx.beginPath(); ctx.ellipse(0,0,pf.size*0.5,pf.size,0,0,Math.PI*2);
    const pg=ctx.createRadialGradient(0,0,0,0,0,pf.size);
    pg.addColorStop(0,pf.innerColor); pg.addColorStop(1,pf.petalColor);
    ctx.fillStyle=pg; ctx.shadowColor=pf.petalColor; ctx.shadowBlur=6; ctx.fill();
    ctx.restore();
  }

  // Burst sparks
  for (let i=burstParticles.length-1; i>=0; i--) {
    const bp=burstParticles[i];
    bp.x+=bp.vx; bp.y+=bp.vy; bp.vy+=0.04; bp.alpha-=bp.decay;
    if (bp.alpha<=0) { burstParticles.splice(i,1); continue; }
    ctx.beginPath(); ctx.arc(bp.x,bp.y,bp.size,0,2*Math.PI);
    ctx.fillStyle=bp.color; ctx.shadowColor=bp.color; ctx.shadowBlur=8; ctx.fill();
  }

  ctx.restore();
}

// =========================================================================
// 6. STEM & FOLIAGE
// =========================================================================
function drawStemAndLeaves(ctx, rootX, rootY, flowerX, flowerY, grow, foliage, wind, species, midX, midY) {
  ctx.save();

  // Stem shadow
  ctx.lineWidth=18+(1-grow)*6; ctx.lineCap="round";
  ctx.strokeStyle="rgba(0,0,0,0.22)";
  ctx.beginPath(); ctx.moveTo(rootX+4,rootY+4); ctx.quadraticCurveTo(midX+4,midY+4,flowerX+4,flowerY+4); ctx.stroke();

  // Main stalk
  ctx.lineWidth=12+(1-grow)*4;
  const sg=ctx.createLinearGradient(rootX,rootY,flowerX,flowerY);
  sg.addColorStop(0,"#064e3b"); sg.addColorStop(0.35,"#065f46");
  sg.addColorStop(0.65,species.colors.stem); sg.addColorStop(1,species.colors.leaf);
  ctx.strokeStyle=sg; ctx.shadowColor="rgba(16,185,129,0.5)"; ctx.shadowBlur=12;
  ctx.beginPath(); ctx.moveTo(rootX,rootY); ctx.quadraticCurveTo(midX,midY,flowerX,flowerY); ctx.stroke();

  // Specular highlight stripe
  ctx.lineWidth=3; ctx.strokeStyle="rgba(167,243,208,0.22)"; ctx.shadowBlur=0;
  ctx.beginPath(); ctx.moveTo(rootX-3,rootY); ctx.quadraticCurveTo(midX-3,midY,flowerX-3,flowerY); ctx.stroke();

  // Leaves with venation
  const baseLeaves = Math.floor(2+grow*5+foliage*5);
  for (let i=1; i<=baseLeaves; i++) {
    const t = i/(baseLeaves+1);
    if (t > grow+0.12) continue;
    const lx=(1-t)*(1-t)*rootX+2*(1-t)*t*midX+t*t*flowerX;
    const ly=(1-t)*(1-t)*rootY+2*(1-t)*t*midY+t*t*flowerY;
    const side = i%2===0?1:-1;
    const leafAge = Math.min(1,(grow-(t-0.12))*5);
    const leafLength=(26+grow*32+foliage*28)*Math.min(1,grow*1.6)*leafAge;
    const leafWidth=leafLength*0.48;
    const leafAngle=(side*Math.PI)/3.2+Math.sin(windPhase*0.9+i*1.3)*(0.12+wind*0.18);
    ctx.save(); ctx.translate(lx,ly); ctx.rotate(leafAngle);

    // Drop shadow
    ctx.beginPath(); ctx.moveTo(2,2);
    ctx.bezierCurveTo(leafWidth+2,-leafWidth+2,leafLength-leafWidth+2,-leafWidth*0.5+2,leafLength+2,2);
    ctx.bezierCurveTo(leafWidth*0.5+2,leafWidth+2,leafWidth*0.5+2,leafWidth+2,2,2);
    ctx.fillStyle="rgba(0,0,0,0.18)"; ctx.fill();

    // Leaf body
    ctx.beginPath(); ctx.moveTo(0,0);
    ctx.bezierCurveTo(leafWidth,-leafWidth,leafLength-leafWidth,-leafWidth*0.5,leafLength,0);
    ctx.bezierCurveTo(leafWidth*0.5,leafWidth,leafWidth*0.5,leafWidth,0,0);
    const lg=ctx.createLinearGradient(0,0,leafLength,0);
    lg.addColorStop(0,species.colors.stem); lg.addColorStop(0.4,species.colors.leaf);
    lg.addColorStop(0.8,"#4ade80"); lg.addColorStop(1,"#6ee7b7");
    ctx.fillStyle=lg; ctx.shadowColor="rgba(52,211,153,0.4)"; ctx.shadowBlur=8; ctx.fill();

    // Shine
    ctx.globalAlpha=0.28;
    const shG=ctx.createLinearGradient(0,-leafWidth*0.5,leafLength*0.4,leafWidth*0.3);
    shG.addColorStop(0,"rgba(255,255,255,0.6)"); shG.addColorStop(1,"transparent");
    ctx.beginPath(); ctx.moveTo(0,0);
    ctx.bezierCurveTo(leafWidth*0.5,-leafWidth*0.5,leafLength*0.4,-leafWidth*0.3,leafLength*0.5,0); ctx.lineTo(0,0);
    ctx.fillStyle=shG; ctx.fill(); ctx.globalAlpha=1;

    // Midrib
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(leafLength*0.88,0);
    ctx.strokeStyle="rgba(255,255,255,0.36)"; ctx.lineWidth=1.8; ctx.shadowBlur=0; ctx.stroke();

    // Side veins (3 pairs)
    for (let v=1; v<=3; v++) {
      const vt=v/4.5, vx=leafLength*vt, vLen=leafWidth*(1-vt)*0.85;
      ctx.strokeStyle=`rgba(255,255,255,${0.16-v*0.03})`; ctx.lineWidth=0.85;
      for (const sv of [1,-1]) {
        ctx.beginPath(); ctx.moveTo(vx,0);
        ctx.quadraticCurveTo(vx+leafLength*0.08,sv*vLen*0.5,vx+leafLength*0.12,sv*vLen); ctx.stroke();
      }
    }
    ctx.restore();
  }
  ctx.restore();
}

// =========================================================================
// 7. PETAL DRAWING
// =========================================================================
function drawLilyPetal(ctx, length, width, bloom, species, isOuterSepal, petalIndex, time) {
  ctx.save();
  const ao = PETAL_ANIM_OFFSETS[petalIndex % PETAL_ANIM_OFFSETS.length];
  ctx.rotate(Math.sin(time*ao.wobbleSpeed+ao.wobble)*0.03*bloom + ao.tiltWobble);

  ctx.beginPath(); ctx.moveTo(0,0);
  ctx.bezierCurveTo(-width*0.72,-length*0.22,-width*1.02,-length*0.62,-width*0.42,-length*0.92);
  ctx.bezierCurveTo(-width*0.12,-length*1.06, width*0.12,-length*1.06, width*0.42,-length*0.92);
  ctx.bezierCurveTo( width*1.02,-length*0.62, width*0.72,-length*0.22,0,0);
  ctx.closePath();

  const grad=ctx.createRadialGradient(0,-length*0.18,2,0,-length*0.52,length*1.1);
  grad.addColorStop(0.00,"#bef264"); grad.addColorStop(0.15,"#d9f99d");
  grad.addColorStop(0.32,"#ffffff"); grad.addColorStop(0.60,"#fbcfe8");
  grad.addColorStop(0.88,"#f472b6"); grad.addColorStop(1.00,"#e11d48");
  ctx.fillStyle=grad; ctx.shadowColor="rgba(244,114,182,0.4)"; ctx.shadowBlur=12; ctx.fill();

  // Shimmer
  const sa = 0.18+0.2*Math.sin(time*ao.shimmerSpeed+ao.shimmerPhase);
  const sg=ctx.createLinearGradient(-width,-length*0.2,width*0.5,-length*0.7);
  sg.addColorStop(0,`rgba(255,255,255,${sa})`); sg.addColorStop(0.5,"transparent"); sg.addColorStop(1,`rgba(255,255,255,${sa*0.3})`);
  ctx.globalAlpha=0.88; ctx.fillStyle=sg; ctx.fill(); ctx.globalAlpha=1;

  // Edge
  ctx.strokeStyle="rgba(255,255,255,0.55)"; ctx.lineWidth=1.3;
  ctx.beginPath(); ctx.moveTo(0,0);
  ctx.bezierCurveTo(-width*0.72,-length*0.22,-width*1.02,-length*0.62,-width*0.42,-length*0.92);
  ctx.bezierCurveTo(-width*0.12,-length*1.06,width*0.12,-length*1.06,width*0.42,-length*0.92);
  ctx.bezierCurveTo(width*1.02,-length*0.62,width*0.72,-length*0.22,0,0); ctx.stroke();

  // Midrib
  ctx.beginPath(); ctx.moveTo(0,-2); ctx.quadraticCurveTo(0,-length*0.5,0,-length*0.96);
  ctx.strokeStyle="rgba(101,163,13,0.55)"; ctx.lineWidth=2.5; ctx.shadowColor="#84cc16"; ctx.shadowBlur=4; ctx.stroke();

  // Side veins
  const vPairs = isOuterSepal?3:5;
  ctx.shadowBlur=0;
  for (let v=1; v<=vPairs; v++) {
    const vt=v/(vPairs+1.5), vy=-length*vt, vLen=width*(1-vt*0.7)*0.72;
    ctx.strokeStyle=`rgba(74,222,128,${0.25-v*0.02})`; ctx.lineWidth=0.85;
    for (const sv of [1,-1]) {
      ctx.beginPath(); ctx.moveTo(0,vy); ctx.quadraticCurveTo(sv*vLen*0.5,vy-length*0.06,sv*vLen,vy-length*0.04); ctx.stroke();
    }
  }

  // Freckles
  const spk = isOuterSepal?6:12;
  for (let s=1; s<=spk; s++) {
    const sy=-length*(0.16+(s/spk)*0.48), sx=(s%2===0?1:-1)*(1+(s%3)*0.35)*(width*0.16), rad=1.0+(s%4)*0.45;
    ctx.beginPath(); ctx.arc(sx,sy,rad,0,2*Math.PI);
    ctx.fillStyle="#881337"; ctx.shadowColor="#be123c"; ctx.shadowBlur=3; ctx.fill();
  }
  ctx.restore();
}

function drawGenericPetal(ctx, length, width, bloom, species, layerIndex, petalIndex, time) {
  const type=species.petalType;
  const ao=PETAL_ANIM_OFFSETS[petalIndex % PETAL_ANIM_OFFSETS.length];
  ctx.save();
  ctx.rotate(Math.sin(time*ao.wobbleSpeed+ao.wobble)*0.025*bloom + ao.tiltWobble*0.6);

  ctx.beginPath();
  if (type==="lotus") {
    ctx.moveTo(0,0);
    ctx.bezierCurveTo(-width*0.75,-length*0.38,-width*0.95,-length*0.78,-width*0.1,-length*0.97);
    ctx.bezierCurveTo(-width*0.05,-length*1.02,width*0.05,-length*1.02,width*0.1,-length*0.97);
    ctx.bezierCurveTo(width*0.95,-length*0.78,width*0.75,-length*0.38,0,0);
  } else if (type==="rose") {
    const wv=width*0.18*bloom;
    ctx.moveTo(0,0);
    ctx.bezierCurveTo(-width*1.18,-length*0.28,-width*1.08,-length*0.86,-wv,-length);
    ctx.bezierCurveTo(wv*0.3,-length*1.05,-wv*0.3,-length*1.05,wv,-length);
    ctx.bezierCurveTo(width*1.08,-length*0.86,width*1.18,-length*0.28,0,0);
  } else if (type==="sunflower") {
    ctx.moveTo(0,0);
    ctx.bezierCurveTo(-width*0.52,-length*0.48,-width*0.32,-length*0.88,0,-length);
    ctx.bezierCurveTo(width*0.32,-length*0.88,width*0.52,-length*0.48,0,0);
  } else if (type==="sakura") {
    ctx.moveTo(0,0);
    ctx.bezierCurveTo(-width,-length*0.48,-width*0.82,-length*0.92,-width*0.22,-length);
    ctx.bezierCurveTo(-width*0.08,-length*1.04,0,-length*0.9,0,-length*0.88);
    ctx.bezierCurveTo(0,-length*0.9,width*0.08,-length*1.04,width*0.22,-length);
    ctx.bezierCurveTo(width*0.82,-length*0.92,width,-length*0.48,0,0);
  } else {
    ctx.moveTo(0,0);
    ctx.bezierCurveTo(-width*1.28,-length*0.28,-width*0.42,-length*0.78,0,-length);
    ctx.bezierCurveTo(width*0.42,-length*0.78,width*1.28,-length*0.28,0,0);
  }

  const depth=0.5+layerIndex*0.5/Math.max(1,species.petalLayers-1);
  const grad=ctx.createRadialGradient(0,-length*0.35,1,0,-length*0.5,length);
  grad.addColorStop(0,species.colors.petalInner);
  grad.addColorStop(0.55*depth,species.colors.petalOuter);
  grad.addColorStop(1,species.colors.petalBase);
  ctx.fillStyle=grad; ctx.shadowColor=species.colors.glow; ctx.shadowBlur=10; ctx.fill();

  // Shimmer
  const sa=0.12+0.18*Math.sin(time*ao.shimmerSpeed+ao.shimmerPhase);
  const sg=ctx.createLinearGradient(-width*0.5,-length*0.1,width*0.3,-length*0.65);
  sg.addColorStop(0,`rgba(255,255,255,${sa})`); sg.addColorStop(0.6,"transparent");
  ctx.globalAlpha=0.82; ctx.fillStyle=sg; ctx.fill(); ctx.globalAlpha=1;

  ctx.strokeStyle="rgba(255,255,255,0.2)"; ctx.lineWidth=0.9; ctx.stroke();

  // Midrib
  ctx.beginPath(); ctx.moveTo(0,-1); ctx.quadraticCurveTo(0,-length*0.5,0,-length*0.94);
  ctx.strokeStyle="rgba(255,255,255,0.26)"; ctx.lineWidth=1.4; ctx.shadowBlur=0; ctx.stroke();

  // Side veins
  const vP = type==="sunflower"?2:3;
  for (let v=1; v<=vP; v++) {
    const vt=v/(vP+1),vy=-length*vt,vLen=width*(1-vt*0.5)*0.6;
    ctx.strokeStyle=`rgba(255,255,255,${0.13-v*0.02})`; ctx.lineWidth=0.7;
    for (const sv of [1,-1]) {
      ctx.beginPath(); ctx.moveTo(0,vy); ctx.quadraticCurveTo(sv*vLen*0.4,vy-length*0.05,sv*vLen,vy); ctx.stroke();
    }
  }
  if (type==="sunflower") {
    ctx.strokeStyle="rgba(120,70,0,0.22)"; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-length*0.9); ctx.stroke();
  }
  ctx.restore();
}

// =========================================================================
// 8. FLOWER HEAD
// =========================================================================
function drawFlowerHead(ctx, cx, cy, bloom, grow, sparkle, species, customScale=1.0, rotation=0, time=0) {
  ctx.save();
  ctx.translate(cx,cy);
  if (rotation!==0) ctx.rotate(rotation);
  const scale=(0.4+grow*0.65)*customScale;
  ctx.scale(scale,scale);

  // Multi-layer glow aura
  if (bloom > 0.15) {
    const auraRad=(80+bloom*110+sparkle*45)*customScale;
    const ag1=ctx.createRadialGradient(0,0,5,0,0,auraRad*1.5);
    ag1.addColorStop(0,species.colors.glow.replace(/[\d.]+\)$/,`${0.07*bloom})`));
    ag1.addColorStop(1,"transparent");
    ctx.fillStyle=ag1; ctx.beginPath(); ctx.arc(0,0,auraRad*1.5,0,2*Math.PI); ctx.fill();

    const ag2=ctx.createRadialGradient(0,0,3,0,0,auraRad);
    ag2.addColorStop(0,species.colors.glow.replace(/[\d.]+\)$/,`${0.28*bloom})`));
    ag2.addColorStop(0.6,species.colors.glow.replace(/[\d.]+\)$/,`${0.11*bloom})`));
    ag2.addColorStop(1,"transparent");
    ctx.fillStyle=ag2; ctx.beginPath(); ctx.arc(0,0,auraRad,0,2*Math.PI); ctx.fill();

    // Rotating sparkle rays
    if (sparkle > 0.3) {
      ctx.save(); ctx.rotate(time*0.4);
      for (let r=0; r<8; r++) {
        const ra=(r/8)*Math.PI*2, rLen=auraRad*0.7*sparkle;
        const rAlpha=0.08+0.15*sparkle;
        const rg=ctx.createLinearGradient(Math.cos(ra)*8,Math.sin(ra)*8,Math.cos(ra)*rLen,Math.sin(ra)*rLen);
        rg.addColorStop(0,species.colors.glow.replace(/[\d.]+\)$/,`${rAlpha})`));
        rg.addColorStop(1,"transparent");
        ctx.strokeStyle=rg; ctx.lineWidth=2+sparkle*2;
        ctx.beginPath(); ctx.moveTo(Math.cos(ra)*8,Math.sin(ra)*8); ctx.lineTo(Math.cos(ra)*rLen,Math.sin(ra)*rLen); ctx.stroke();
      }
      ctx.restore();
    }
  }

  const layers=species.petalLayers, totalPetals=species.petalCount;
  const maxPL=(species.petalType==="lily"?82:68)+bloom*(species.petalType==="lily"?78:68);
  const maxPW=(species.petalType==="lily"?30:24)+bloom*(species.petalType==="lily"?36:32);

  if (species.petalType==="lily") {
    const outerBloom=clamp(bloom*1.15,0.08,1);
    for (let i=0;i<3;i++) {
      ctx.save(); ctx.rotate((i*2*Math.PI)/3+Math.PI/6);
      ctx.scale(0.22+outerBloom*0.78,0.22+outerBloom*0.78);
      drawLilyPetal(ctx,maxPL*0.95,maxPW*0.85,outerBloom,species,true,i,time); ctx.restore();
    }
    const innerBloom=clamp(bloom*1.3,0.06,1);
    for (let i=0;i<3;i++) {
      ctx.save(); ctx.rotate((i*2*Math.PI)/3-Math.PI/6);
      ctx.scale(0.25+innerBloom*0.75,0.25+innerBloom*0.75);
      drawLilyPetal(ctx,maxPL,maxPW,innerBloom,species,false,i+3,time); ctx.restore();
    }
  } else {
    for (let l=0;l<layers;l++) {
      const layerRatio=(l+1)/layers;
      const petalsInLayer=Math.round(totalPetals/layers);
      const layerBloom=clamp(bloom*1.2-(1-layerRatio)*0.35,0.04,1);
      const pL=maxPL*(0.62+layerRatio*0.38), pW=maxPW*(0.62+layerRatio*0.38);
      const laOff=(l*Math.PI)/petalsInLayer;
      for (let p=0;p<petalsInLayer;p++) {
        ctx.save(); ctx.rotate((p*2*Math.PI)/petalsInLayer+laOff);
        ctx.scale(0.18+layerBloom*0.82,0.18+layerBloom*0.82);
        drawGenericPetal(ctx,pL,pW,layerBloom,species,l,l*petalsInLayer+p,time); ctx.restore();
      }
    }
  }

  // ---- CENTERS ----
  if (species.petalType==="lily") {
    const throatG=ctx.createRadialGradient(0,0,1,0,0,18);
    throatG.addColorStop(0,"#65a30d"); throatG.addColorStop(0.6,"#bef264"); throatG.addColorStop(1,"transparent");
    ctx.beginPath(); ctx.arc(0,0,18,0,2*Math.PI); ctx.fillStyle=throatG; ctx.fill();

    const stL=46+bloom*46;
    for (let s=0;s<6;s++) {
      const sA=(s*Math.PI*2)/6+Math.PI/12, sw=Math.sin(time*1.2+s*1.1)*5*bloom;
      ctx.save(); ctx.rotate(sA);
      ctx.strokeStyle="#d9f99d"; ctx.lineWidth=2.5; ctx.lineCap="round";
      ctx.shadowColor="#84cc16"; ctx.shadowBlur=6;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(sw,-stL*0.55,sw*1.2,-stL); ctx.stroke();
      // T-anther
      ctx.fillStyle="#fbbf24"; ctx.shadowColor="#f59e0b"; ctx.shadowBlur=8;
      ctx.beginPath(); ctx.ellipse(sw*1.2,-stL,4.5,2.5,0,0,Math.PI*2); ctx.fill();
      if (bloom>0.5) {
        for (let pd=0;pd<3;pd++) {
          ctx.beginPath(); ctx.arc(sw*1.2+(pd-1)*2.5,-stL-1.5,1,0,Math.PI*2);
          ctx.fillStyle=`rgba(254,240,138,${0.7*bloom})`; ctx.shadowBlur=3; ctx.fill();
        }
      }
      ctx.restore();
    }
    // Pistil
    ctx.save(); ctx.fillStyle="#166534";
    ctx.beginPath(); ctx.ellipse(0,-stL*0.5,3,stL*0.5,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#4ade80"; ctx.beginPath(); ctx.arc(0,-stL*0.98,6,0,Math.PI*2); ctx.fill(); ctx.restore();

  } else if (species.petalType==="sunflower") {
    const discR=28+bloom*24;
    const dg=ctx.createRadialGradient(0,0,0,0,0,discR);
    dg.addColorStop(0,"#292524"); dg.addColorStop(0.6,"#451a03"); dg.addColorStop(1,"#78350f");
    ctx.beginPath(); ctx.arc(0,0,discR,0,2*Math.PI);
    ctx.fillStyle=dg; ctx.shadowColor="#78350f"; ctx.shadowBlur=10; ctx.fill();

    const floretCount=Math.floor(40+bloom*55);
    for (let s=0;s<floretCount;s++) {
      const sa=s*2.39996, sr=Math.sqrt(s/floretCount)*(discR*0.92);
      const fB=clamp((bloom-(1-s/floretCount)*0.5)*2,0,1);
      const fR=1.5+fB*1.5;
      const fg=ctx.createRadialGradient(Math.cos(sa)*sr,Math.sin(sa)*sr,0,Math.cos(sa)*sr,Math.sin(sa)*sr,fR*2);
      fg.addColorStop(0,`rgba(253,224,71,${0.5+fB*0.5})`); fg.addColorStop(1,`rgba(180,120,0,${0.2*fB})`);
      ctx.beginPath(); ctx.arc(Math.cos(sa)*sr,Math.sin(sa)*sr,fR,0,Math.PI*2);
      ctx.fillStyle=fg; ctx.shadowColor="rgba(250,204,21,0.6)"; ctx.shadowBlur=3; ctx.fill();
    }
    const cH=ctx.createRadialGradient(0,0,0,0,0,discR*0.3);
    cH.addColorStop(0,"rgba(255,255,255,0.15)"); cH.addColorStop(1,"transparent");
    ctx.beginPath(); ctx.arc(0,0,discR*0.3,0,2*Math.PI); ctx.fillStyle=cH; ctx.fill();

  } else if (species.petalType==="cosmic") {
    const cR=22+bloom*18;
    const cg=ctx.createRadialGradient(0,0,0,0,0,cR);
    cg.addColorStop(0,"#f0abfc"); cg.addColorStop(0.3,"#a855f7"); cg.addColorStop(0.7,"#3b82f6"); cg.addColorStop(1,"transparent");
    ctx.beginPath(); ctx.arc(0,0,cR,0,2*Math.PI);
    ctx.fillStyle=cg; ctx.shadowColor="#a855f7"; ctx.shadowBlur=30+sparkle*20; ctx.fill();

    for (let ring=0;ring<3;ring++) {
      const rR=cR*(0.5+ring*0.35), rA=0.15+ring*0.08+sparkle*0.2;
      ctx.save(); ctx.rotate(time*(0.5+ring*0.3)*(ring%2===0?1:-1));
      ctx.beginPath(); ctx.arc(0,0,rR,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${ring===0?"240,171,252":ring===1?"59,130,246":"6,182,212"},${rA})`;
      ctx.lineWidth=1.5; ctx.shadowColor=ring===0?"#f0abfc":"#06b6d4"; ctx.shadowBlur=8; ctx.stroke(); ctx.restore();
    }
    const sC=Math.floor(15+bloom*25);
    for (let s=0;s<sC;s++) {
      const sa=s*2.39996,sr=Math.sqrt(s/sC)*(cR*0.85);
      const tw=0.4+0.6*Math.sin(time*2.5+s*0.7);
      ctx.beginPath(); ctx.arc(Math.cos(sa)*sr,Math.sin(sa)*sr,1.2,0,Math.PI*2);
      ctx.fillStyle=`rgba(240,171,252,${tw})`; ctx.shadowColor="#f0abfc"; ctx.shadowBlur=5; ctx.fill();
    }

  } else {
    const cR=16+bloom*18;
    const cg=ctx.createRadialGradient(0,0,1,0,0,cR);
    cg.addColorStop(0,"#fff"); cg.addColorStop(0.25,species.colors.center);
    cg.addColorStop(0.8,species.colors.petalBase); cg.addColorStop(1,"#1e293b");
    ctx.beginPath(); ctx.arc(0,0,cR,0,2*Math.PI);
    ctx.fillStyle=cg; ctx.shadowColor=species.colors.center; ctx.shadowBlur=16; ctx.fill();

    const sC=Math.floor(10+bloom*28);
    for (let s=0;s<sC;s++) {
      const sa=s*2.39996, sr=Math.sqrt(s/sC)*(cR*0.85);
      const px=Math.cos(sa)*sr, py=Math.sin(sa)*sr, dR=1.4+bloom*0.8;
      const dg=ctx.createRadialGradient(px,py,0,px,py,dR*2);
      dg.addColorStop(0,"#fef08a"); dg.addColorStop(1,"rgba(245,158,11,0)");
      ctx.beginPath(); ctx.arc(px,py,dR,0,Math.PI*2);
      ctx.fillStyle=dg; ctx.shadowColor="#fef08a"; ctx.shadowBlur=4; ctx.fill();
    }
    const chG=ctx.createRadialGradient(-2,-2,0,0,0,cR*0.5);
    chG.addColorStop(0,"rgba(255,255,255,0.45)"); chG.addColorStop(1,"transparent");
    ctx.beginPath(); ctx.arc(0,0,cR*0.5,0,2*Math.PI); ctx.fillStyle=chG; ctx.fill();
  }

  ctx.restore();
}

function drawBranchBlossom(ctx, startX, startY, endX, endY, bloom, grow, sparkle, species, scale, rotation, time) {
  ctx.save();
  ctx.lineWidth=7; ctx.lineCap="round";
  const bg=ctx.createLinearGradient(startX,startY,endX,endY);
  bg.addColorStop(0,species.colors.stem); bg.addColorStop(1,species.colors.leaf);
  ctx.strokeStyle=bg;
  const mX=(startX+endX)/2+Math.sin(windPhase)*6, mY=(startY+endY)/2+10;
  ctx.beginPath(); ctx.moveTo(startX,startY); ctx.quadraticCurveTo(mX,mY,endX,endY); ctx.stroke();
  drawFlowerHead(ctx,endX,endY,bloom,grow,sparkle,species,scale,rotation,time);
  ctx.restore();
}

// =========================================================================
// 9. GROUND & ROOT
// =========================================================================
function drawGround(ctx, w, h, rootX) {
  ctx.save();
  const sg=ctx.createRadialGradient(rootX,h,0,rootX,h,w*0.25);
  sg.addColorStop(0,"rgba(41,25,22,0.85)"); sg.addColorStop(0.5,"rgba(28,16,10,0.6)"); sg.addColorStop(1,"transparent");
  ctx.beginPath(); ctx.ellipse(rootX,h,w*0.28,h*0.06,0,0,Math.PI*2); ctx.fillStyle=sg; ctx.fill();
  for (let r=0;r<4;r++) {
    const angle=Math.PI/6+(r/3)*(Math.PI*2/3), len=25+r*8;
    ctx.beginPath(); ctx.moveTo(rootX,h-2);
    ctx.quadraticCurveTo(rootX+Math.cos(angle)*len*0.5,h+len*0.5,rootX+Math.cos(angle)*len,h+len);
    ctx.strokeStyle="rgba(78,46,32,0.55)"; ctx.lineWidth=2.5-r*0.4; ctx.lineCap="round"; ctx.stroke();
  }
  ctx.restore();
}

// =========================================================================
// 10. DEW DROPS
// =========================================================================
function drawDewDrops(ctx, cx, cy, bloom) {
  ctx.save();
  for (let d=0;d<5;d++) {
    const da=(d/5)*Math.PI*2+globalTime*0.1, dr=35+Math.sin(globalTime*0.7+d)*8;
    const dx=cx+Math.cos(da)*dr, dy=cy+Math.sin(da)*dr*0.6;
    const dS=2.5+Math.sin(globalTime*1.2+d*0.8)*0.8;
    const dg=ctx.createRadialGradient(dx-dS*0.3,dy-dS*0.3,0.2,dx,dy,dS);
    dg.addColorStop(0,"rgba(255,255,255,0.9)");
    dg.addColorStop(0.5,`rgba(255,255,255,${0.35*bloom})`);
    dg.addColorStop(1,"rgba(200,220,255,0.15)");
    ctx.beginPath(); ctx.arc(dx,dy,dS,0,Math.PI*2);
    ctx.fillStyle=dg; ctx.shadowColor="rgba(200,230,255,0.6)"; ctx.shadowBlur=4; ctx.fill();
  }
  ctx.restore();
}

// =========================================================================
// 11. MAIN RENDER
// =========================================================================
function renderFlowerCanvas() {
  if (!flowerCtx || !flowerCanvas) return;
  const w=flowerCanvas.width, h=flowerCanvas.height;
  flowerCtx.clearRect(0,0,w,h);

  currentStemHeight = lerp(currentStemHeight,targetStemHeight,0.12);
  currentFoliage    = lerp(currentFoliage,   targetFoliage,   0.12);
  currentBloom      = lerp(currentBloom,     targetBloom,     0.12);
  currentSparkle    = lerp(currentSparkle,   targetSparkle,   0.12);
  currentWind       = lerp(currentWind,      targetWind,      0.12);
  currentHandX      = lerp(currentHandX,     targetHandX,     0.08);
  currentHandY      = lerp(currentHandY,     targetHandY,     0.08);

  windPhase  += 0.025 + currentWind*0.038;
  globalTime += 0.016;

  const species=FLOWER_SPECIES[currentSpeciesIndex];

  // HUD
  const growP=Math.round(((currentStemHeight+currentFoliage)/2)*100);
  const bloomP=Math.round(((currentBloom+currentSparkle)/2)*100);
  if (growBar)        growBar.style.width=`${growP}%`;
  if (bloomBar)       bloomBar.style.width=`${bloomP}%`;
  if (growValueText)  growValueText.textContent=`${growP}%`;
  if (bloomValueText) bloomValueText.textContent=`${bloomP}%`;
  if (stemValueText)  stemValueText.textContent=`${Math.round(currentStemHeight*100)}%`;
  if (foliageValueText) foliageValueText.textContent=`${Math.round(currentFoliage*100)}%`;
  if (petalValueText)   petalValueText.textContent=`${Math.round(currentBloom*100)}%`;
  if (sparkleValueText) sparkleValueText.textContent=`${Math.round(currentSparkle*100)}%`;

  // Plant coords
  const rootX=w*0.5+(currentHandX-0.5)*w*0.22, rootY=h*0.97;
  const stemPx=h*0.16+currentStemHeight*(h*0.68-h*0.16);
  const hOX=(currentHandX-0.5)*w*0.55, hOY=(currentHandY-0.5)*h*0.22;
  const flowerX=w*0.5+hOX+Math.sin(windPhase)*(14*currentStemHeight+currentWind*20);
  const flowerY=rootY-stemPx+hOY;
  const swayOff=Math.sin(windPhase)*(18*currentStemHeight+currentWind*25);
  const midX=(rootX+flowerX)/2+swayOff, midY=(rootY+flowerY)/2;

  // Spawn effects
  if (currentSparkle>0.65 && Math.random()<0.22) spawnBurst(flowerX,flowerY,7,species.colors.glow);
  if (currentBloom>0.5 && currentWind>0.3 && petalFallParticles.length<MAX_PETAL_FALL && Math.random()<0.06)
    petalFallParticles.push(makePetalFall(flowerX,flowerY,species));

  // Draw layers
  updateAndDrawParticles(flowerCtx,w,h,flowerX,flowerY,species,currentBloom,currentSparkle);
  drawGround(flowerCtx,w,h,rootX);
  drawStemAndLeaves(flowerCtx,rootX,rootY,flowerX,flowerY,currentStemHeight,currentFoliage,currentWind,species,midX,midY);

  if (species.clusterBranches && currentStemHeight>0.25) {
    const tL=0.68;
    const b1SX=(1-tL)*(1-tL)*rootX+2*(1-tL)*tL*midX+tL*tL*flowerX;
    const b1SY=(1-tL)*(1-tL)*rootY+2*(1-tL)*tL*midY+tL*tL*flowerY;
    drawBranchBlossom(flowerCtx,b1SX,b1SY,b1SX-(65+currentFoliage*45)*Math.min(1,currentStemHeight*1.5),b1SY-(35+currentStemHeight*20),currentBloom,currentStemHeight,currentSparkle,species,0.70,-0.35,globalTime);
    const tR=0.78;
    const b2SX=(1-tR)*(1-tR)*rootX+2*(1-tR)*tR*midX+tR*tR*flowerX;
    const b2SY=(1-tR)*(1-tR)*rootY+2*(1-tR)*tR*midY+tR*tR*flowerY;
    drawBranchBlossom(flowerCtx,b2SX,b2SY,b2SX+(70+currentFoliage*45)*Math.min(1,currentStemHeight*1.5),b2SY-(40+currentStemHeight*20),currentBloom,currentStemHeight,currentSparkle,species,0.74,0.38,globalTime);
    if (currentFoliage>0.4) {
      const tB=0.50;
      const b3SX=(1-tB)*(1-tB)*rootX+2*(1-tB)*tB*midX+tB*tB*flowerX;
      const b3SY=(1-tB)*(1-tB)*rootY+2*(1-tB)*tB*midY+tB*tB*flowerY;
      drawBranchBlossom(flowerCtx,b3SX,b3SY,b3SX-50*currentFoliage,b3SY-25,currentBloom*0.75,currentStemHeight,currentSparkle,species,0.52,-0.45,globalTime);
    }
  }

  drawFlowerHead(flowerCtx,flowerX,flowerY,currentBloom,currentStemHeight,currentSparkle,species,1.0,0,globalTime);

  if (currentBloom>0.6 && currentWind<0.35)
    drawDewDrops(flowerCtx,flowerX,flowerY,currentBloom);
}

// =========================================================================
// 12. CAMERA OVERLAY
// =========================================================================
const HAND_SKELETON_BONES=[
  [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],[5,9],[9,13],[13,17],
];

function drawCameraOverlays() {
  if (!overlayCtx||!overlayCanvas) return;
  if (overlayCanvas.width!==video.videoWidth||overlayCanvas.height!==video.videoHeight) {
    overlayCanvas.width=video.videoWidth||640; overlayCanvas.height=video.videoHeight||480;
  }
  overlayCtx.clearRect(0,0,overlayCanvas.width,overlayCanvas.height);
  if (!showSkeleton) return;
  const w=overlayCanvas.width, h=overlayCanvas.height;
  for (const hand of activeHandsData) {
    const isLeft=hand.role==="left";
    const pc=isLeft?"#34d399":"#f472b6", sc=isLeft?"#6ee7b7":"#fbcfe8";
    overlayCtx.save();
    overlayCtx.lineWidth=3; overlayCtx.strokeStyle=isLeft?"rgba(52,211,153,0.6)":"rgba(244,114,182,0.6)";
    overlayCtx.shadowColor=pc; overlayCtx.shadowBlur=8;
    for (const [s,e] of HAND_SKELETON_BONES) {
      overlayCtx.beginPath(); overlayCtx.moveTo(hand.lm[s].x*w,hand.lm[s].y*h);
      overlayCtx.lineTo(hand.lm[e].x*w,hand.lm[e].y*h); overlayCtx.stroke();
    }
    overlayCtx.lineWidth=5; overlayCtx.strokeStyle=pc;
    overlayCtx.beginPath();
    overlayCtx.moveTo(hand.thumbTip.x*w,hand.thumbTip.y*h);
    overlayCtx.lineTo(hand.indexTip.x*w,hand.indexTip.y*h); overlayCtx.stroke();
    const nodes=[
      {pt:hand.thumbTip,label:"👍",color:"#ffffff"},
      {pt:hand.indexTip,label:isLeft?"🌱 THÂN":"🌸 NỞ",color:pc},
      {pt:hand.middleTip,label:isLeft?"🍃 LÁ":"✨ HÀO QUANG",color:sc},
      {pt:hand.pinkyTip,label:isLeft?"💨 GIÓ":"💫 PHẤN",color:"#fef08a"},
    ];
    for (const node of nodes) {
      const nx=node.pt.x*w, ny=node.pt.y*h;
      overlayCtx.beginPath(); overlayCtx.arc(nx,ny,7,0,2*Math.PI);
      overlayCtx.fillStyle=node.color; overlayCtx.shadowColor=node.color; overlayCtx.shadowBlur=10; overlayCtx.fill();
      overlayCtx.font="bold 11px -apple-system,sans-serif";
      overlayCtx.fillStyle="#ffffff"; overlayCtx.shadowColor="#000"; overlayCtx.shadowBlur=4;
      overlayCtx.textAlign="center"; overlayCtx.fillText(node.label,nx,ny-12);
    }
    overlayCtx.restore();
  }
}

// =========================================================================
// 13. SNAPSHOT
// =========================================================================
async function takeSnapshot() {
  playShutterSound();
  flashOverlay.classList.add("flashing");
  setTimeout(()=>flashOverlay.classList.remove("flashing"),120);
  const off=document.createElement("canvas"), offCtx=off.getContext("2d");
  off.width=1280; off.height=720;
  offCtx.fillStyle="#07090e"; offCtx.fillRect(0,0,1280,720);
  offCtx.save();
  if (isMirrored) { offCtx.translate(640,0); offCtx.scale(-1,1); offCtx.drawImage(video,0,0,640,720); }
  else offCtx.drawImage(video,0,0,640,720);
  offCtx.restore();
  if (showSkeleton&&overlayCanvas) {
    offCtx.save();
    if (isMirrored) { offCtx.translate(640,0); offCtx.scale(-1,1); }
    offCtx.drawImage(overlayCanvas,0,0,640,720); offCtx.restore();
  }
  if (flowerCanvas) offCtx.drawImage(flowerCanvas,640,0,640,720);
  offCtx.fillStyle="rgba(15,23,42,0.88)";
  if (offCtx.roundRect) offCtx.roundRect(24,24,520,58,24); else offCtx.rect(24,24,520,58);
  offCtx.fill(); offCtx.fillStyle="#fbcfe8";
  offCtx.font="bold 22px 'Plus Jakarta Sans',sans-serif";
  const sp=FLOWER_SPECIES[currentSpeciesIndex];
  offCtx.fillText(`${sp.icon} Flora Bloom - ${sp.name}`,48,60);
  const a=document.createElement("a"); a.href=off.toDataURL("image/png");
  a.download=`flora_bloom_${Date.now()}.png`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  showToast("📸 Đã lưu tác phẩm hoa vào thư viện!");
}

// =========================================================================
// 14. CAMERA & RESIZE
// =========================================================================
async function startCamera(facing=currentFacingMode) {
  if (currentStream) currentStream.getTracks().forEach(t=>t.stop());
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("Trình duyệt không hỗ trợ Camera. HTTPS required!");
  currentStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:facing,width:{ideal:640},height:{ideal:480}},audio:false});
  video.srcObject=currentStream; await video.play();
  currentFacingMode=facing; isMirrored=facing==="user"; updateMirrorState();
}

function updateMirrorState() {
  if (isMirrored) {
    video.classList.remove("unmirrored"); overlayCanvas?.classList.remove("unmirrored"); btnMirror.classList.add("active");
  } else {
    video.classList.add("unmirrored"); overlayCanvas?.classList.add("unmirrored"); btnMirror.classList.remove("active");
  }
}

function resizeFlowerCanvas() {
  if (!flowerCanvas||!flowerPane) return;
  const r=flowerPane.getBoundingClientRect();
  flowerCanvas.width=r.width||600; flowerCanvas.height=r.height||600;
}

// =========================================================================
// 15. SPECIES & LAYOUT
// =========================================================================
function buildSpeciesDrawer() {
  if (!speciesGrid) return; speciesGrid.innerHTML="";
  FLOWER_SPECIES.forEach((item,idx)=>{
    const card=document.createElement("div");
    card.className=`species-card ${idx===currentSpeciesIndex?"selected":""}`;
    card.innerHTML=`<div class="species-card-icon">${item.icon}</div><div class="species-card-title">${item.name}</div><div class="species-card-desc">${item.desc}</div>`;
    card.addEventListener("click",()=>{ currentSpeciesIndex=idx; updateActiveSpecies(); speciesDrawer.classList.add("hidden"); showToast(`Đã chọn: ${item.icon} ${item.name}`); });
    speciesGrid.appendChild(card);
  });
}

function updateActiveSpecies() {
  const item=FLOWER_SPECIES[currentSpeciesIndex];
  if (speciesBadgeIcon) speciesBadgeIcon.textContent=item.icon;
  if (speciesBadgeName) speciesBadgeName.textContent=item.name;
  buildSpeciesDrawer();
}

function applyLayout() {
  const layout=LAYOUT_MODES[currentLayoutIndex];
  appContainer.className=["app-container",layout.id,...(isSwapped?["is-swapped"]:[])].join(" ");
  resizeFlowerCanvas();
}

function toggleFullscreen() {
  const doc=document, isFull=!!(doc.fullscreenElement||doc.webkitFullscreenElement);
  if (!isFull) {
    doc.documentElement.requestFullscreen?.().catch(()=>{});
    btnFullscreen?.classList.add("active"); showToast("⛶ Toàn màn hình");
  } else {
    doc.exitFullscreen?.().catch(()=>{});
    btnFullscreen?.classList.remove("active"); showToast("Thu nhỏ màn hình");
  }
}

// =========================================================================
// 16. MAIN LOOP
// =========================================================================
function loop() {
  if (!isRunning) return;
  if (video.currentTime!==lastVideoTime) {
    lastVideoTime=video.currentTime;
    const handResult=handLandmarker.detectForVideo(video,performance.now());
    processHandGestures(handResult); drawCameraOverlays();
  }
  renderFlowerCanvas();
  requestAnimationFrame(loop);
}

// =========================================================================
// 17. INIT
// =========================================================================
async function init() {
  initParticles(); buildSpeciesDrawer(); updateActiveSpecies();
  window.addEventListener("resize",resizeFlowerCanvas); resizeFlowerCanvas();
  try {
    overlayTitle.textContent="Đang tải mô hình AI..."; overlayDesc.textContent="MediaPipe Vision Models đang được nạp...";
    const fileset=await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");
    overlayDesc.textContent="Đang khởi tạo Hand Tracking Engine...";
    handLandmarker=await HandLandmarker.createFromOptions(fileset,{
      baseOptions:{modelAssetPath:"https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",delegate:"GPU"},
      runningMode:"VIDEO", numHands:2,
    });
    overlayTitle.textContent="Flora Bloom Đã Sẵn Sàng!";
    overlayDesc.textContent="Nhấn nút bên dưới để cấp quyền camera và bắt đầu điều khiển hoa nở.";
    spinner.style.display="none"; startBtn.style.display="inline-block";
    startCamera("user").then(()=>{ loadingOverlay.classList.add("hidden"); isRunning=true; initAudio(); resizeFlowerCanvas(); requestAnimationFrame(loop); })
      .catch(err=>console.warn("User interaction required:",err));
  } catch(err) {
    spinner.style.display="none"; overlayTitle.textContent="Có lỗi xảy ra";
    overlayDesc.textContent="Không thể tải mô hình hoặc kết nối camera.";
    errorBanner.style.display="block"; errorBanner.innerText=err.message||String(err);
  }
}

startBtn.addEventListener("click",async()=>{
  try { initAudio(); errorBanner.style.display="none"; await startCamera(currentFacingMode); loadingOverlay.classList.add("hidden"); isRunning=true; resizeFlowerCanvas(); requestAnimationFrame(loop); }
  catch(err) { errorBanner.style.display="block"; errorBanner.innerText=err.message||String(err); }
});

btnSpecies.addEventListener("click",()=>speciesDrawer.classList.remove("hidden"));
speciesBadge.addEventListener("click",()=>speciesDrawer.classList.remove("hidden"));
btnCloseDrawer.addEventListener("click",()=>speciesDrawer.classList.add("hidden"));
speciesDrawer.addEventListener("click",e=>{ if(e.target===speciesDrawer) speciesDrawer.classList.add("hidden"); });
btnLayout.addEventListener("click",()=>{ currentLayoutIndex=(currentLayoutIndex+1)%LAYOUT_MODES.length; applyLayout(); showToast(`🪟 Bố cục: ${LAYOUT_MODES[currentLayoutIndex].name}`); });
btnSwap.addEventListener("click",()=>{ isSwapped=!isSwapped; applyLayout(); showToast(isSwapped?"🔁 Đã đổi vị trí (Hoa ⇄ Cam)":"🔁 Vị trí mặc định (Cam ⇄ Hoa)"); });
btnSwitchCam.addEventListener("click",async()=>{
  const t=currentFacingMode==="user"?"environment":"user";
  try { await startCamera(t); showToast(t==="user"?"📷 Camera trước":"📸 Camera sau"); } catch(err) { alert("Không thể chuyển camera: "+err.message); }
});
btnSnapshot.addEventListener("click",takeSnapshot);
btnSound.addEventListener("click",()=>{
  soundEnabled=!soundEnabled;
  btnSound.classList.toggle("active",soundEnabled); btnSound.textContent=soundEnabled?"🔊 Âm thanh":"🔇 Tắt tiếng";
  if (soundEnabled) { playBotanicalChime(4,0.2); showToast("Đã bật âm thanh thiên nhiên 🔊"); } else showToast("Đã tắt âm thanh 🔇");
});
btnFullscreen.addEventListener("click",toggleFullscreen);
btnMirror.addEventListener("click",()=>{ isMirrored=!isMirrored; updateMirrorState(); });
btnSkeleton.addEventListener("click",()=>{
  showSkeleton=!showSkeleton; btnSkeleton.classList.toggle("active",showSkeleton);
  if (!showSkeleton && overlayCtx && overlayCanvas) overlayCtx.clearRect(0,0,overlayCanvas.width,overlayCanvas.height);
});

init();
