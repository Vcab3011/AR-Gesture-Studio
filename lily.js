import {
  HandLandmarker,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";

// =========================================================================
// 1. FLORAL SPECIES CATALOG (BILINGUAL EN & VI)
// =========================================================================
const SPECIES_CATALOG = {
  lily: {
    id: "lily",
    name_en: "Royal Pink Lily",
    name_vi: "Hoa Ly Hoàng Gia",
    icon: "⚜️",
    desc_en: "Oriental Pink Lily with crimson papillae and golden pollen",
    desc_vi: "Oriental Pink Lily kiêu sa với đốm mật và nhụy vàng",
    petalCount: 6,
    petalLayers: 2,
    petalType: "lily",
    colors: {
      petalTip: "#f472b6",
      petalBody: "#fbcfe8",
      petalCream: "#ffffff",
      petalThroat: "#bef264",
      petalThroatDeep: "#65a30d",
      papillae: "#881337",
      filament: "#d9f99d",
      anther: "#9a3412",
      stigmaHead: "#166534",
      stemDark: "#064e3b",
      stemMid: "#047857",
      stemLight: "#10b981",
      leafDark: "#14532d",
      leafMid: "#15803d",
      glow: "rgba(244, 114, 182, 0.45)",
      shimmer: "rgba(255, 255, 255, 0.70)",
    },
  },
  rose: {
    id: "rose",
    name_en: "Velvet Red Rose",
    name_vi: "Hoa Hồng Đỏ Nhung",
    icon: "🌹",
    desc_en: "Noble velvet red rose with spiraling grand petals",
    desc_vi: "Hoa hồng đỏ nhung quý phái với nhiều lớp cánh xoáy",
    petalCount: 24,
    petalLayers: 4,
    petalType: "rose",
    colors: {
      petalTip: "#e11d48",
      petalBody: "#be123c",
      petalCream: "#ffe4e6",
      petalThroat: "#881337",
      petalThroatDeep: "#4c0519",
      stemDark: "#14532d",
      stemMid: "#15803d",
      stemLight: "#22c55e",
      leafDark: "#064e3b",
      leafMid: "#166534",
      glow: "rgba(225, 29, 72, 0.50)",
      shimmer: "rgba(255, 180, 200, 0.60)",
    },
  },
  sakura: {
    id: "sakura",
    name_en: "Japanese Sakura",
    name_vi: "Hoa Anh Đào Nhật Bản",
    icon: "🌸",
    desc_en: "Pristine cherry blossom with heart-notched silk petals",
    desc_vi: "Sakura tinh khôi với cánh xẻ hình trái tim thanh nhã",
    petalCount: 10,
    petalLayers: 2,
    petalType: "sakura",
    colors: {
      petalTip: "#f472b6",
      petalBody: "#fbcfe8",
      petalCream: "#ffffff",
      petalThroat: "#fda4af",
      petalThroatDeep: "#f43f5e",
      stemDark: "#3f2d20",
      stemMid: "#78350f",
      stemLight: "#b45309",
      leafDark: "#15803d",
      leafMid: "#4ade80",
      glow: "rgba(251, 207, 232, 0.50)",
      shimmer: "rgba(255, 225, 240, 0.70)",
    },
  },
  sunflower: {
    id: "sunflower",
    name_en: "Golden Sunflower",
    name_vi: "Hoa Hướng Dương Rực Rỡ",
    icon: "🌻",
    desc_en: "Radiant golden florets blooming toward the sunlight",
    desc_vi: "Hướng dương vàng rực rỡ hướng về ánh mặt trời",
    petalCount: 26,
    petalLayers: 2,
    petalType: "sunflower",
    colors: {
      petalTip: "#facc15",
      petalBody: "#f59e0b",
      petalCream: "#fef08a",
      petalThroat: "#78350f",
      petalThroatDeep: "#451a03",
      stemDark: "#14532d",
      stemMid: "#15803d",
      stemLight: "#84cc16",
      leafDark: "#064e3b",
      leafMid: "#166534",
      glow: "rgba(245, 158, 11, 0.55)",
      shimmer: "rgba(255, 245, 140, 0.65)",
    },
  },
  lotus: {
    id: "lotus",
    name_en: "Sacred Pink Lotus",
    name_vi: "Hoa Sen Hồng Tinh Khiết",
    icon: "🪷",
    desc_en: "Divine floating lotus with golden core receptacle",
    desc_vi: "Quốc hoa sen hồng thanh cao với đài sen vàng kim",
    petalCount: 18,
    petalLayers: 3,
    petalType: "lotus",
    colors: {
      petalTip: "#ec4899",
      petalBody: "#f472b6",
      petalCream: "#ffffff",
      petalThroat: "#fde047",
      petalThroatDeep: "#eab308",
      stemDark: "#064e3b",
      stemMid: "#047857",
      stemLight: "#10b981",
      leafDark: "#14532d",
      leafMid: "#15803d",
      glow: "rgba(236, 72, 153, 0.50)",
      shimmer: "rgba(255, 210, 235, 0.65)",
    },
  },
  cosmic: {
    id: "cosmic",
    name_en: "Cosmic Night Orchid",
    name_vi: "Lan Dạ Quang Vũ Trụ",
    icon: "🌌",
    desc_en: "Bioluminescent galaxy orchid with glowing stardust",
    desc_vi: "Bioluminescent phát sáng dạ quang kỳ ảo với bụi sao",
    petalCount: 14,
    petalLayers: 3,
    petalType: "cosmic",
    colors: {
      petalTip: "#06b6d4",
      petalBody: "#a855f7",
      petalCream: "#e0e7ff",
      petalThroat: "#3b82f6",
      petalThroatDeep: "#1e1b4b",
      stemDark: "#0c4a6e",
      stemMid: "#0284c7",
      stemLight: "#38bdf8",
      leafDark: "#1e1b4b",
      leafMid: "#06b6d4",
      glow: "rgba(6, 182, 212, 0.70)",
      shimmer: "rgba(160, 100, 255, 0.60)",
    },
  },
  tulip: {
    id: "tulip",
    name_en: "Dutch Royal Tulip",
    name_vi: "Hoa Tulip Hà Lan",
    icon: "🌷",
    desc_en: "Elegant cup-shaped royal Dutch crimson tulip",
    desc_vi: "Tulip hoàng gia hình chén thanh lịch rực rỡ",
    petalCount: 6,
    petalLayers: 2,
    petalType: "tulip",
    colors: {
      petalTip: "#f43f5e",
      petalBody: "#fb7185",
      petalCream: "#fff1f2",
      petalThroat: "#fde047",
      petalThroatDeep: "#ca8a04",
      stemDark: "#064e3b",
      stemMid: "#059669",
      stemLight: "#34d399",
      leafDark: "#14532d",
      leafMid: "#16a34a",
      glow: "rgba(244, 63, 94, 0.50)",
      shimmer: "rgba(255, 230, 235, 0.65)",
    },
  },
};

// =========================================================================
// 2. BILINGUAL I18N SYSTEM (ENGLISH 🇬🇧 / VIETNAMESE 🇻🇳)
// =========================================================================
let currentLang = "vi";

const I18N = {
  en: {
    growHeader: "🌿 LEFT (GROW)",
    bloomHeader: "🌸 RIGHT (BLOOM)",
    stemHeightLabel: "🌱 Stem Height:",
    selectedLabel: "Selected:",
    growHint: "⋮⋮ Drag • Double-tap: Toggle Gestures",
    bloomHint: "⋮⋮ Drag • Thumb+Index: Bloom",
    drawerTitle: "🌸 Choose Flower to Plant",
    btnAdd: "➕ Add Flower",
    btnSelectAll: "✨ Select All",
    btnSelectAllOn: "✨ Selected All",
    btnGestureStart: "🖐️ Start Gestures",
    btnGestureOn: "🖐️ Gestures: ON",
    btnZoomOut: "🔍 Zoom Out",
    btnZoomIn: "🔍 Zoom In",
    btnDelete: "🗑️ Delete",
    btnSwitchCam: "🔄 Switch Cam",
    btnSnapshot: "📸 Capture AR",
    btnSound: "🔊 Sound",
    btnSoundOff: "🔇 Muted",
    btnFullscreen: "⛶ Fullscreen",
    btnFullscreenExit: "⛶ Exit Fullscreen",
    btnMirror: "🪞 Mirror",
    overlayTitle: "Flora AR Studio 🌸",
    overlayDesc: "Interactive AR Botanical Garden. Tap below to launch camera.",
    startBtn: "🌸 Open AR Garden",
    toastSelected: (name, id) => `✨ Selected: ${name} (#${id})`,
    toastMultiSelected: (count) => `✨ Selected ${count} flowers to bloom together!`,
    toastSelectAll: (count) => `✨ Selected all ${count} flowers to bloom together!`,
    toastAdded: (name) => `🌱 Planted sprout: ${name}!`,
    toastDeleted: "🗑️ Selected flowers removed!",
    toastSize: (val) => `🔍 Size: ${val}%`,
    toastPlaced: "📍 Flower placed at new position!",
    toastMinOne: "⚠️ Your garden needs at least 1 flower!",
    toastGesturesOn: (count) => `🖐️ Gestures ON (${count} flower(s)) • Double-tap to toggle!`,
    toastGesturesOff: "✋ Gestures OFF • Double-tap to toggle.",
    tagSelecting: "Selected",
    allChip: "✨ All Flowers",
    dragPrompt: "📍 Placing flower here",
    watermarkTitle: "🌸 Flora AR Studio - Interactive Garden",
    photoSaved: "📸 Beautiful AR snapshot saved to gallery!",
  },
  vi: {
    growHeader: "🌿 TAY TRÁI (GROW)",
    bloomHeader: "🌸 TAY PHẢI (BLOOM)",
    stemHeightLabel: "🌱 Chiều cao thân:",
    selectedLabel: "Đang chọn:",
    growHint: "⋮⋮ Kéo thả • Nhấp đúp 2 lần: Cử chỉ",
    bloomHint: "⋮⋮ Kéo thả • Cái+Trỏ: Nở",
    drawerTitle: "🌸 Chọn Loài Hoa Muốn Thêm",
    btnAdd: "➕ Thêm Hoa",
    btnSelectAll: "✨ Chọn Tất Cả",
    btnSelectAllOn: "✨ Đã Chọn Tất Cả",
    btnGestureStart: "🖐️ Khởi động cử chỉ",
    btnGestureOn: "🖐️ Cử chỉ: Đang Bật",
    btnGestureOff: "✋ Cử chỉ: Đang Tắt",
    btnZoomOut: "🔍 Thu nhỏ",
    btnZoomIn: "🔍 Phóng to",
    btnDelete: "🗑️ Xóa hoa",
    btnSwitchCam: "🔄 Đổi Cam",
    btnSnapshot: "📸 Chụp AR",
    btnSound: "🔊 Âm thanh",
    btnSoundOff: "🔇 Tắt tiếng",
    btnFullscreen: "⛶ Phóng to",
    btnFullscreenExit: "⛶ Thu nhỏ",
    btnMirror: "🪞 Gương",
    overlayTitle: "Flora AR Studio 🌸",
    overlayDesc: "Vườn hoa AR tương tác cử chỉ. Nhấn bên dưới để mở Camera.",
    startBtn: "🌸 Mở Vườn Hoa AR",
    toastSelected: (name, id) => `✨ Đang chọn: ${name} (#${id})`,
    toastMultiSelected: (count) => `✨ Đã chọn ${count} đóa hoa để cùng nở!`,
    toastSelectAll: (count) => `✨ Đã chọn tất cả ${count} đóa hoa để cùng nở!`,
    toastAdded: (name) => `🌱 Đã trồng mầm: ${name}!`,
    toastDeleted: "🗑️ Đã xóa đóa hoa được chọn!",
    toastSize: (val) => `🔍 Kích thước: ${val}%`,
    toastPlaced: "📍 Đã đặt hoa tại vị trí mới!",
    toastMinOne: "⚠️ Vườn cần ít nhất 1 đóa hoa!",
    toastGesturesOn: (count) => `🖐️ Đã BẬT cử chỉ (${count} hoa) • Nhấp đúp 2 lần để bật/tắt!`,
    toastGesturesOff: "✋ Đã TẮT cử chỉ • Nhấp đúp 2 lần để bật lại.",
    tagSelecting: "Đang chọn",
    allChip: "✨ Tất cả hoa",
    dragPrompt: "📍 Đang đặt hoa tại vị trí này",
    watermarkTitle: "🌸 Flora AR Studio - Vườn Hoa Tương Tác",
    photoSaved: "📸 Đã lưu bức ảnh AR tuyệt đẹp cùng vườn hoa!",
  },
};

function t(key, ...args) {
  const dict = I18N[currentLang] || I18N.vi;
  const val = dict[key];
  if (typeof val === "function") return val(...args);
  return val || key;
}

function getSpeciesName(spec) {
  if (!spec) return "";
  return currentLang === "vi" ? spec.name_vi : spec.name_en;
}

function getSpeciesDesc(spec) {
  if (!spec) return "";
  return currentLang === "vi" ? spec.desc_vi : spec.desc_en;
}

function updateUILanguage() {
  const btnLang = document.getElementById("btnLang");
  if (btnLang) {
    btnLang.textContent = currentLang === "en" ? "🌐 EN" : "🌐 VI";
  }

  const activeGrowLabel = document.getElementById("activeGrowLabel");
  if (activeGrowLabel) activeGrowLabel.textContent = t("growHeader");

  const activeBloomLabel = document.getElementById("activeBloomLabel");
  if (activeBloomLabel) activeBloomLabel.textContent = t("bloomHeader");

  const stemHeightLabelText = document.getElementById("stemHeightLabelText");
  if (stemHeightLabelText) stemHeightLabelText.textContent = t("stemHeightLabel");

  const growMeterHint = document.getElementById("growMeterHint");
  if (growMeterHint) growMeterHint.textContent = t("growHint");

  const bloomMeterHint = document.getElementById("bloomMeterHint");
  if (bloomMeterHint) bloomMeterHint.textContent = t("bloomHint");

  const btnAdd = document.getElementById("btnAddFlower");
  if (btnAdd) btnAdd.textContent = t("btnAdd");

  const btnSelAll = document.getElementById("btnSelectAll");
  if (btnSelAll) {
    const allSelected = flowers.length > 0 && selectedFlowerIds.size === flowers.length;
    btnSelAll.textContent = allSelected ? t("btnSelectAllOn") : t("btnSelectAll");
    btnSelAll.classList.toggle("active", allSelected);
  }

  const btnGest = document.getElementById("btnGesture");
  if (btnGest) {
    btnGest.textContent = gestureTrackingEnabled ? t("btnGestureOn") : t("btnGestureStart");
  }

  const btnZOut = document.getElementById("btnZoomOut");
  if (btnZOut) btnZOut.textContent = t("btnZoomOut");

  const btnZIn = document.getElementById("btnZoomIn");
  if (btnZIn) btnZIn.textContent = t("btnZoomIn");

  const btnDel = document.getElementById("btnDeleteFlower");
  if (btnDel) btnDel.textContent = t("btnDelete");

  const btnCam = document.getElementById("btnSwitchCam");
  if (btnCam) btnCam.textContent = t("btnSwitchCam");

  const btnSnap = document.getElementById("btnSnapshot");
  if (btnSnap) btnSnap.textContent = t("btnSnapshot");

  const btnSnd = document.getElementById("btnSound");
  if (btnSnd) btnSnd.textContent = soundEnabled ? t("btnSound") : t("btnSoundOff");

  const btnFull = document.getElementById("btnFullscreen");
  if (btnFull) {
    const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
    btnFull.textContent = isFull ? t("btnFullscreenExit") : t("btnFullscreen");
  }

  const btnMir = document.getElementById("btnMirror");
  if (btnMir) btnMir.textContent = t("btnMirror");

  const drawerHeader = document.querySelector(".drawer-header h3");
  if (drawerHeader) drawerHeader.textContent = t("drawerTitle");

  initSpeciesDrawer();
  renderFlowerChips();
}

// =========================================================================
// 3. DOM ELEMENTS & STATE
// =========================================================================
const video = document.getElementById("video");
const arCanvas = document.getElementById("arCanvas");
const arCtx = arCanvas ? arCanvas.getContext("2d") : null;

const meterGrow = document.getElementById("meterGrow");
const meterBloom = document.getElementById("meterBloom");

const growBar = document.getElementById("growBar");
const bloomBar = document.getElementById("bloomBar");
const growValueText = document.getElementById("growValueText");
const bloomValueText = document.getElementById("bloomValueText");
const stemValueText = document.getElementById("stemValueText");
const petalValueText = document.getElementById("petalValueText");
const flowerActiveName = document.getElementById("flowerActiveName");

const flowersChipsBar = document.getElementById("flowersChipsBar");
const speciesDrawer = document.getElementById("speciesDrawer");
const speciesGrid = document.getElementById("speciesGrid");
const btnAddFlower = document.getElementById("btnAddFlower");
const btnSelectAll = document.getElementById("btnSelectAll");
const btnCloseDrawer = document.getElementById("btnCloseDrawer");
const btnDeleteFlower = document.getElementById("btnDeleteFlower");
const btnLang = document.getElementById("btnLang");

const btnZoomIn = document.getElementById("btnZoomIn");
const btnZoomOut = document.getElementById("btnZoomOut");

const loadingOverlay = document.getElementById("loadingOverlay");
const spinner = document.getElementById("spinner");
const overlayTitle = document.getElementById("overlayTitle");
const overlayDesc = document.getElementById("overlayDesc");
const startBtn = document.getElementById("startBtn");
const errorBanner = document.getElementById("errorBanner");
const flashOverlay = document.getElementById("flashOverlay");
const toast = document.getElementById("toast");

const btnGesture = document.getElementById("btnGesture");
const btnSwitchCam = document.getElementById("btnSwitchCam");
const btnSnapshot = document.getElementById("btnSnapshot");
const btnSound = document.getElementById("btnSound");
const btnFullscreen = document.getElementById("btnFullscreen");
const btnMirror = document.getElementById("btnMirror");

// MediaPipe State
let handLandmarker = null;
let currentStream = null;
let currentFacingMode = "user";
let isMirrored = true;
let soundEnabled = true;
let isRunning = true;
let lastVideoTime = -1;

// Gesture Recognition Mode Toggle
let gestureTrackingEnabled = false;

// Multi-flower instances
let flowers = [
  {
    id: 1,
    speciesId: "lily",
    x: 0.50,
    y: 0.78,
    targetX: 0.50,
    targetY: 0.78,
    headX: 0,
    headY: 0,
    stemHeight: 0.0,
    targetStemHeight: 0.0,
    bloom: 0.0,
    targetBloom: 0.0,
    scale: 0.65,
  },
];

let selectedFlowerIds = new Set([1]);
let nextFlowerId = 2;

// Smooth Dragging & Pinch State
let isDragging = false;
let dragFlowerId = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

let initialPinchDist = null;
let initialFlowerScale = 0.65;
let isPinching = false;

let dragAuraPulse = 0;
let windPhase = 0;
let globalTime = 0;

// Particle Systems
let particles = [];
let burstParticles = [];
let pollenParticles = [];
let petalFallParticles = [];
const MAX_PARTICLES = 80;
const MAX_POLLEN = 60;
const MAX_PETAL_FALL = 30;

// Active Hand Landmarks
let activeHandsData = [];

// Per-petal organic animation presets (flutter + shimmer phase offsets)
const PETAL_ANIM_OFFSETS = Array.from({ length: 64 }, () => ({
  wobble: Math.random() * Math.PI * 2,
  wobbleSpeed: 0.4 + Math.random() * 0.8,
  shimmerPhase: Math.random() * Math.PI * 2,
  shimmerSpeed: 1.0 + Math.random() * 1.5,
  tiltWobble: (Math.random() - 0.5) * 0.08,
}));

// =========================================================================
// 4. PROCEDURAL WEB AUDIO SYNTHESIZER
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
    if (now - lastChimeTime < 0.12) return;
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
// 5. GESTURE TOGGLE ENGINE (SUPPORT DOUBLE-TAP)
// =========================================================================
function toggleGestureTracking(sourceX = null, sourceY = null) {
  initAudio();
  gestureTrackingEnabled = !gestureTrackingEnabled;
  if (gestureTrackingEnabled) {
    if (btnGesture) {
      btnGesture.classList.add("active");
      btnGesture.textContent = t("btnGestureOn");
    }
    playBotanicalChime(6, 0.25);
    const count = selectedFlowerIds.size;
    showToast(t("toastGesturesOn", count));
    if (sourceX !== null && sourceY !== null) {
      spawnBurst(sourceX, sourceY, 20, "#34d399");
    }
  } else {
    if (btnGesture) {
      btnGesture.classList.remove("active");
      btnGesture.textContent = t("btnGestureStart");
    }
    activeHandsData = [];
    playBotanicalChime(2, 0.18);
    showToast(t("toastGesturesOff"));
    if (sourceX !== null && sourceY !== null) {
      spawnBurst(sourceX, sourceY, 14, "#f472b6");
    }
  }
}

// =========================================================================
// 6. MULTI-FLOWER MANAGEMENT & MULTI-SELECTION
// =========================================================================
function getSelectedFlowers() {
  const list = flowers.filter((f) => selectedFlowerIds.has(f.id));
  if (list.length === 0 && flowers.length > 0) {
    selectedFlowerIds.add(flowers[0].id);
    return [flowers[0]];
  }
  return list;
}

function toggleSelectFlower(id, multi = true) {
  if (!multi) {
    selectedFlowerIds.clear();
    selectedFlowerIds.add(id);
  } else {
    if (selectedFlowerIds.has(id)) {
      if (selectedFlowerIds.size > 1) {
        selectedFlowerIds.delete(id);
      }
    } else {
      selectedFlowerIds.add(id);
    }
  }

  renderFlowerChips();
  playBotanicalChime(4, 0.18);

  const selectedList = getSelectedFlowers();
  if (selectedList.length === 1) {
    const flower = selectedList[0];
    const spec = SPECIES_CATALOG[flower.speciesId] || SPECIES_CATALOG.lily;
    showToast(t("toastSelected", `${spec.icon} ${getSpeciesName(spec)}`, flower.id));
  } else {
    showToast(t("toastMultiSelected", selectedList.length));
  }

  updateUILanguage();
}

function selectAllFlowers() {
  if (flowers.length === 0) return;

  if (selectedFlowerIds.size === flowers.length) {
    selectedFlowerIds.clear();
    selectedFlowerIds.add(flowers[0].id);
    playBotanicalChime(2, 0.15);
    const flower = flowers[0];
    const spec = SPECIES_CATALOG[flower.speciesId] || SPECIES_CATALOG.lily;
    showToast(t("toastSelected", `${spec.icon} ${getSpeciesName(spec)}`, flower.id));
  } else {
    selectedFlowerIds.clear();
    flowers.forEach((f) => selectedFlowerIds.add(f.id));
    playBotanicalChime(6, 0.25);
    showToast(t("toastSelectAll", flowers.length));
  }

  renderFlowerChips();
  updateUILanguage();
}

function addFlower(speciesId) {
  const spec = SPECIES_CATALOG[speciesId] || SPECIES_CATALOG.lily;

  // Stagger flowers across screen nicely
  const offset = ((flowers.length % 5) - 2) * 0.14;
  const slotX = Math.max(0.15, Math.min(0.85, 0.50 + offset));
  const slotY = 0.78;

  const newFlower = {
    id: nextFlowerId++,
    speciesId,
    x: slotX,
    y: slotY,
    targetX: slotX,
    targetY: slotY,
    headX: 0,
    headY: 0,
    stemHeight: 0.0,
    targetStemHeight: 0.0,
    bloom: 0.0,
    targetBloom: 0.0,
    scale: 0.65,
  };

  flowers.push(newFlower);
  selectedFlowerIds.clear();
  selectedFlowerIds.add(newFlower.id);
  renderFlowerChips();

  playBotanicalChime(6, 0.25);
  spawnBurst(slotX * window.innerWidth, slotY * window.innerHeight, 20, spec.colors.petalTip);
  showToast(t("toastAdded", `${spec.icon} ${getSpeciesName(spec)}`));

  closeSpeciesDrawer();
}

function deleteSelectedFlowers() {
  if (flowers.length <= 1) {
    showToast(t("toastMinOne"));
    return;
  }

  flowers = flowers.filter((f) => !selectedFlowerIds.has(f.id));
  if (flowers.length === 0) {
    init();
    return;
  }

  selectedFlowerIds.clear();
  selectedFlowerIds.add(flowers[0].id);

  renderFlowerChips();
  playBotanicalChime(1, 0.15);
  showToast(t("toastDeleted"));
  updateUILanguage();
}

function zoomSelectedFlowers(delta) {
  const selectedList = getSelectedFlowers();
  if (selectedList.length === 0) return;

  selectedList.forEach((flower) => {
    flower.scale = Math.min(2.8, Math.max(0.30, (flower.scale || 0.65) + delta));
  });

  playBotanicalChime(delta > 0 ? 5 : 2, 0.15);
  const avgScale = Math.round((selectedList[0].scale || 0.65) * 100);
  showToast(t("toastSize", avgScale));
}

function renderFlowerChips() {
  if (!flowersChipsBar) return;
  flowersChipsBar.innerHTML = "";

  // 1. Quick Select All
  const allSelected = flowers.length > 0 && selectedFlowerIds.size === flowers.length;
  const allChip = document.createElement("button");
  allChip.className = `flower-chip ${allSelected ? "active" : ""}`;
  allChip.style.background = allSelected ? "linear-gradient(135deg, #f59e0b, #ec4899)" : "rgba(245, 158, 11, 0.15)";
  allChip.style.borderColor = "#f59e0b";
  allChip.innerHTML = `${t("allChip")} (${selectedFlowerIds.size}/${flowers.length})`;
  allChip.onclick = selectAllFlowers;
  flowersChipsBar.appendChild(allChip);

  // 2. Flower Chips
  flowers.forEach((flower) => {
    const spec = SPECIES_CATALOG[flower.speciesId] || SPECIES_CATALOG.lily;
    const isSelected = selectedFlowerIds.has(flower.id);
    const chip = document.createElement("button");
    chip.className = `flower-chip ${isSelected ? "active" : ""}`;
    chip.innerHTML = `${spec.icon} ${getSpeciesName(spec)} #${flower.id}`;
    chip.onclick = () => toggleSelectFlower(flower.id, true);
    flowersChipsBar.appendChild(chip);
  });

  // 3. Add Flower Chip
  const addChip = document.createElement("button");
  addChip.className = "flower-chip flower-chip-btn-add";
  addChip.innerHTML = t("btnAdd");
  addChip.onclick = openSpeciesDrawer;
  flowersChipsBar.appendChild(addChip);
}

function initSpeciesDrawer() {
  if (!speciesGrid) return;
  speciesGrid.innerHTML = "";

  Object.values(SPECIES_CATALOG).forEach((spec) => {
    const card = document.createElement("div");
    card.className = "species-card";
    card.innerHTML = `
      <div class="species-card-icon">${spec.icon}</div>
      <div class="species-card-name">${getSpeciesName(spec)}</div>
      <div class="species-card-desc">${getSpeciesDesc(spec)}</div>
    `;
    card.onclick = () => addFlower(spec.id);
    speciesGrid.appendChild(card);
  });
}

function openSpeciesDrawer() {
  if (speciesDrawer) speciesDrawer.classList.add("open");
}

function closeSpeciesDrawer() {
  if (speciesDrawer) speciesDrawer.classList.remove("open");
}

// =========================================================================
// 7. GESTURE RECOGNITION
// =========================================================================
function dist(a, b) {
  if (!a || !b) return 0;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

function processHandGestures(handResult) {
  activeHandsData = [];
  const w = arCanvas ? arCanvas.width : window.innerWidth;
  const h = arCanvas ? arCanvas.height : window.innerHeight;

  if (!gestureTrackingEnabled || !handResult || !handResult.landmarks || handResult.landmarks.length === 0) {
    return;
  }

  const selectedFlowers = getSelectedFlowers();
  if (selectedFlowers.length === 0) return;

  const hands = handResult.landmarks.map((lm, idx) => {
    const wrist = lm[0];
    const palm = lm[9];
    const thumbTip = lm[4];
    const indexTip = lm[8];

    const handScale = dist(wrist, palm) || 0.1;
    const rawThumbIndexPinch = dist(thumbTip, indexTip) / handScale;
    const thumbIndexSpread = clamp((rawThumbIndexPinch - 0.20) / 0.85, 0, 1);

    const thumbScreenX = (isMirrored ? (1 - thumbTip.x) : thumbTip.x) * w;
    const thumbScreenY = thumbTip.y * h;
    const indexScreenX = (isMirrored ? (1 - indexTip.x) : indexTip.x) * w;
    const indexScreenY = indexTip.y * h;

    const effectiveX = isMirrored ? (1 - palm.x) : palm.x;

    let role = effectiveX < 0.5 ? "left" : "right";
    if (handResult.handednesses && handResult.handednesses[idx] && handResult.handednesses[idx][0]) {
      const cat = handResult.handednesses[idx][0].categoryName;
      const anatomicalRole = isMirrored ? (cat === "Right" ? "left" : "right") : (cat === "Left" ? "left" : "right");
      if (effectiveX >= 0.40 && effectiveX <= 0.60) {
        role = anatomicalRole;
      }
    }

    return {
      lm,
      thumbTip,
      indexTip,
      thumbIndexSpread,
      thumbScreenX,
      thumbScreenY,
      indexScreenX,
      indexScreenY,
      role,
    };
  });

  const leftHand = hands.find((h) => h.role === "left");
  const rightHand = hands.find((h) => h.role === "right");

  if (leftHand) {
    selectedFlowers.forEach((f) => {
      f.targetStemHeight = leftHand.thumbIndexSpread;
    });
  }
  if (rightHand) {
    selectedFlowers.forEach((f) => {
      f.targetBloom = rightHand.thumbIndexSpread;
    });
  }

  activeHandsData = hands;

  const refFlower = selectedFlowers[0];
  if (refFlower && Math.abs(refFlower.targetStemHeight - refFlower.stemHeight) > 0.08) {
    const pitchIdx = Math.floor(refFlower.stemHeight * 9);
    playBotanicalChime(pitchIdx, 0.12);
  }
}

// =========================================================================
// 8. PARTICLE ENGINE
// =========================================================================
function initParticles() {
  particles = [];
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.002,
      vy: -0.001 - Math.random() * 0.003,
      size: 1.5 + Math.random() * 3.0,
      alpha: 0.2 + Math.random() * 0.7,
      orbitAngle: Math.random() * Math.PI * 2,
      orbitSpeed: (Math.random() - 0.5) * 0.03,
    });
  }

  pollenParticles = Array.from({ length: MAX_POLLEN }, () => ({
    x: 0.5,
    y: 0.5,
    vx: 0,
    vy: 0,
    size: 1.2 + Math.random() * 2.5,
    alpha: 0,
    targetAlpha: 0.4 + Math.random() * 0.55,
    swayPhase: Math.random() * Math.PI * 2,
    active: false,
    life: 0,
    maxLife: 120 + Math.random() * 160,
  }));
}

function makePetalFall(fx, fy, spec) {
  return {
    x: fx,
    y: fy,
    vx: (Math.random() - 0.5) * 2.2,
    vy: -1.0 - Math.random() * 2.0,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.14,
    size: 8 + Math.random() * 11,
    alpha: 0.85,
    decay: 0.006 + Math.random() * 0.008,
    petalColor: spec.colors.petalTip,
    innerColor: spec.colors.petalCream || spec.colors.petalBody,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.04 + Math.random() * 0.06,
  };
}

function spawnBurst(x, y, count = 14, color = "#f59e0b") {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.0 + Math.random() * 4.5;
    burstParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2.0 + Math.random() * 4.0,
      alpha: 1.0,
      decay: 0.03 + Math.random() * 0.03,
      color,
    });
  }
}

function updateAndDrawParticles(ctx, w, h) {
  ctx.save();

  // 1. Ambient Golden Particles
  for (const p of particles) {
    p.y += p.vy;
    p.x += p.vx + Math.sin(windPhase + p.y * 6) * 0.0015;
    p.orbitAngle += p.orbitSpeed;

    if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
    if (p.x < -0.05) p.x = 1.05;
    if (p.x > 1.05) p.x = -0.05;

    const px = p.x * w;
    const py = p.y * h;

    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(253, 230, 138, ${p.alpha * 0.55})`;
    ctx.shadowColor = "#f472b6";
    ctx.shadowBlur = 8;
    ctx.fill();
  }

  // 2. Pollen Drift Particles
  for (const pp of pollenParticles) {
    if (pp.active) {
      pp.life++;
      pp.alpha = Math.min(pp.targetAlpha, pp.alpha + 0.02);
      if (pp.life > pp.maxLife * 0.7) pp.alpha *= 0.97;
      pp.x += pp.vx + Math.sin(windPhase * 1.3 + pp.swayPhase) * 0.0015;
      pp.y += pp.vy;
      if (pp.life >= pp.maxLife || pp.alpha < 0.02) {
        pp.active = false;
        pp.life = 0;
      }
      ctx.beginPath();
      ctx.arc(pp.x * w, pp.y * h, pp.size, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(254, 240, 138, ${pp.alpha})`;
      ctx.shadowColor = "#fef08a";
      ctx.shadowBlur = 5;
      ctx.fill();
    }
  }

  // 3. Falling Petals
  for (let i = petalFallParticles.length - 1; i >= 0; i--) {
    const pf = petalFallParticles[i];
    pf.wobble += pf.wobbleSpeed;
    pf.x += pf.vx + Math.sin(pf.wobble) * 1.2 + Math.sin(windPhase * 0.7) * 0.8;
    pf.y += pf.vy;
    pf.vy += 0.12;
    pf.rotation += pf.rotSpeed;
    pf.alpha -= pf.decay;

    if (pf.alpha <= 0 || pf.y > h + 30) {
      petalFallParticles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = pf.alpha;
    ctx.translate(pf.x, pf.y);
    ctx.rotate(pf.rotation);
    ctx.beginPath();
    ctx.ellipse(0, 0, pf.size * 0.5, pf.size, 0, 0, Math.PI * 2);
    const pg = ctx.createRadialGradient(0, 0, 0, 0, 0, pf.size);
    pg.addColorStop(0, pf.innerColor);
    pg.addColorStop(1, pf.petalColor);
    ctx.fillStyle = pg;
    ctx.shadowColor = pf.petalColor;
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
  }

  // 4. Sparkle Bursts
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

// =========================================================================
// 9. HIGH-FIDELITY PROCEDURAL BOTANICAL RENDERERS
// =========================================================================

/** Draw a single Lily petal with fine venation, freckle papillae, and specular shimmer */
function drawLilyPetal(ctx, length, width, bloom, spec, isOuterSepal, petalIdx, time) {
  ctx.save();
  const ao = PETAL_ANIM_OFFSETS[petalIdx % PETAL_ANIM_OFFSETS.length];
  ctx.rotate(Math.sin(time * ao.wobbleSpeed + ao.wobble) * 0.03 * bloom + ao.tiltWobble);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-width * 0.72, -length * 0.22, -width * 1.02, -length * 0.62, -width * 0.42, -length * 0.92);
  ctx.bezierCurveTo(-width * 0.12, -length * 1.06, width * 0.12, -length * 1.06, width * 0.42, -length * 0.92);
  ctx.bezierCurveTo(width * 1.02, -length * 0.62, width * 0.72, -length * 0.22, 0, 0);
  ctx.closePath();

  // Multi-stop botanical gradient
  const grad = ctx.createRadialGradient(0, -length * 0.18, 2, 0, -length * 0.52, length * 1.1);
  grad.addColorStop(0.00, spec.colors.petalThroat);
  grad.addColorStop(0.16, "#d9f99d");
  grad.addColorStop(0.34, spec.colors.petalCream);
  grad.addColorStop(0.62, spec.colors.petalBody);
  grad.addColorStop(0.88, spec.colors.petalTip);
  grad.addColorStop(1.00, "#be123c");

  ctx.fillStyle = grad;
  ctx.shadowColor = spec.colors.glow;
  ctx.shadowBlur = 10;
  ctx.fill();

  // Shimmer wash
  const sa = 0.18 + 0.20 * Math.sin(time * ao.shimmerSpeed + ao.shimmerPhase);
  const sg = ctx.createLinearGradient(-width, -length * 0.2, width * 0.5, -length * 0.7);
  sg.addColorStop(0, `rgba(255,255,255,${sa})`);
  sg.addColorStop(0.5, "transparent");
  sg.addColorStop(1, `rgba(255,255,255,${sa * 0.3})`);
  ctx.globalAlpha = 0.88;
  ctx.fillStyle = sg;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Petal Edge
  ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-width * 0.72, -length * 0.22, -width * 1.02, -length * 0.62, -width * 0.42, -length * 0.92);
  ctx.bezierCurveTo(-width * 0.12, -length * 1.06, width * 0.12, -length * 1.06, width * 0.42, -length * 0.92);
  ctx.bezierCurveTo(width * 1.02, -length * 0.62, width * 0.72, -length * 0.22, 0, 0);
  ctx.stroke();

  // Midrib
  ctx.beginPath();
  ctx.moveTo(0, -2);
  ctx.quadraticCurveTo(0, -length * 0.5, 0, -length * 0.96);
  ctx.strokeStyle = "rgba(101, 163, 13, 0.55)";
  ctx.lineWidth = 2.4;
  ctx.shadowColor = "#84cc16";
  ctx.shadowBlur = 4;
  ctx.stroke();

  // Side Veins (5 pairs)
  ctx.shadowBlur = 0;
  const vPairs = isOuterSepal ? 3 : 5;
  for (let v = 1; v <= vPairs; v++) {
    const vt = v / (vPairs + 1.5);
    const vy = -length * vt;
    const vLen = width * (1 - vt * 0.7) * 0.72;
    ctx.strokeStyle = `rgba(74, 222, 128, ${0.24 - v * 0.02})`;
    ctx.lineWidth = 0.85;
    for (const sv of [1, -1]) {
      ctx.beginPath();
      ctx.moveTo(0, vy);
      ctx.quadraticCurveTo(sv * vLen * 0.5, vy - length * 0.06, sv * vLen, vy - length * 0.04);
      ctx.stroke();
    }
  }

  // Freckle Papillae
  const spk = isOuterSepal ? 6 : 12;
  for (let s = 1; s <= spk; s++) {
    const sy = -length * (0.16 + (s / spk) * 0.48);
    const sx = (s % 2 === 0 ? 1 : -1) * (1 + (s % 3) * 0.35) * (width * 0.16);
    const rad = 1.0 + (s % 4) * 0.45;
    ctx.beginPath();
    ctx.arc(sx, sy, rad, 0, 2 * Math.PI);
    ctx.fillStyle = spec.colors.papillae || "#881337";
    ctx.shadowColor = "#be123c";
    ctx.shadowBlur = 3;
    ctx.fill();
  }

  ctx.restore();
}

/** Draw generic petals (Rose, Sakura, Sunflower, Lotus, Cosmic, Tulip) with surface textures */
function drawGenericPetal(ctx, length, width, bloom, spec, layerIdx, petalIdx, time) {
  const type = spec.petalType;
  const ao = PETAL_ANIM_OFFSETS[petalIdx % PETAL_ANIM_OFFSETS.length];

  ctx.save();
  ctx.rotate(Math.sin(time * ao.wobbleSpeed + ao.wobble) * 0.025 * bloom + ao.tiltWobble * 0.6);

  ctx.beginPath();
  if (type === "lotus") {
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-width * 0.75, -length * 0.38, -width * 0.95, -length * 0.78, -width * 0.1, -length * 0.97);
    ctx.bezierCurveTo(-width * 0.05, -length * 1.02, width * 0.05, -length * 1.02, width * 0.1, -length * 0.97);
    ctx.bezierCurveTo(width * 0.95, -length * 0.78, width * 0.75, -length * 0.38, 0, 0);
  } else if (type === "rose") {
    const wave = width * 0.18 * bloom;
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-width * 1.18, -length * 0.28, -width * 1.08, -length * 0.86, -wave, -length);
    ctx.bezierCurveTo(wave * 0.3, -length * 1.05, -wave * 0.3, -length * 1.05, wave, -length);
    ctx.bezierCurveTo(width * 1.08, -length * 0.86, width * 1.18, -length * 0.28, 0, 0);
  } else if (type === "sunflower") {
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-width * 0.52, -length * 0.48, -width * 0.32, -length * 0.88, 0, -length);
    ctx.bezierCurveTo(width * 0.32, -length * 0.88, width * 0.52, -length * 0.48, 0, 0);
  } else if (type === "sakura") {
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-width, -length * 0.48, -width * 0.82, -length * 0.92, -width * 0.22, -length);
    ctx.bezierCurveTo(-width * 0.08, -length * 1.04, 0, -length * 0.90, 0, -length * 0.88);
    ctx.bezierCurveTo(0, -length * 0.90, width * 0.08, -length * 1.04, width * 0.22, -length);
    ctx.bezierCurveTo(width * 0.82, -length * 0.92, width, -length * 0.48, 0, 0);
  } else if (type === "tulip") {
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-width * 0.85, -length * 0.35, -width * 0.95, -length * 0.85, 0, -length);
    ctx.bezierCurveTo(width * 0.95, -length * 0.85, width * 0.85, -length * 0.35, 0, 0);
  } else {
    // Cosmic Orchid
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-width * 1.28, -length * 0.28, -width * 0.42, -length * 0.78, 0, -length);
    ctx.bezierCurveTo(width * 0.42, -length * 0.78, width * 1.28, -length * 0.28, 0, 0);
  }

  const depth = 0.5 + layerIdx * 0.5 / Math.max(1, (spec.petalLayers || 2) - 1);
  const grad = ctx.createRadialGradient(0, -length * 0.35, 1, 0, -length * 0.5, length);
  grad.addColorStop(0.00, spec.colors.petalThroat);
  grad.addColorStop(0.40 * depth, spec.colors.petalCream || spec.colors.petalBody);
  grad.addColorStop(0.80, spec.colors.petalBody);
  grad.addColorStop(1.00, spec.colors.petalTip);

  ctx.fillStyle = grad;
  ctx.shadowColor = spec.colors.glow;
  ctx.shadowBlur = 10;
  ctx.fill();

  // Shimmer
  const sa = 0.12 + 0.18 * Math.sin(time * ao.shimmerSpeed + ao.shimmerPhase);
  const sg = ctx.createLinearGradient(-width * 0.5, -length * 0.1, width * 0.3, -length * 0.65);
  sg.addColorStop(0, `rgba(255,255,255,${sa})`);
  sg.addColorStop(0.6, "transparent");
  ctx.globalAlpha = 0.82;
  ctx.fillStyle = sg;
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  ctx.lineWidth = 0.9;
  ctx.stroke();

  // Midrib
  ctx.beginPath();
  ctx.moveTo(0, -1);
  ctx.quadraticCurveTo(0, -length * 0.5, 0, -length * 0.94);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
  ctx.lineWidth = 1.4;
  ctx.shadowBlur = 0;
  ctx.stroke();

  // Side Veins
  const vP = type === "sunflower" ? 2 : 3;
  for (let v = 1; v <= vP; v++) {
    const vt = v / (vP + 1);
    const vy = -length * vt;
    const vLen = width * (1 - vt * 0.5) * 0.6;
    ctx.strokeStyle = `rgba(255,255,255,${0.13 - v * 0.02})`;
    ctx.lineWidth = 0.7;
    for (const sv of [1, -1]) {
      ctx.beginPath();
      ctx.moveTo(0, vy);
      ctx.quadraticCurveTo(sv * vLen * 0.4, vy - length * 0.05, sv * vLen, vy);
      ctx.stroke();
    }
  }

  if (type === "sunflower") {
    ctx.strokeStyle = "rgba(120, 70, 0, 0.22)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length * 0.9);
    ctx.stroke();
  }

  ctx.restore();
}

/** Render Blossom Head for any Species with Glow Aura and Stamens */
function drawSingleFlowerHead(ctx, bloom, grow, spec, time) {
  // 1. Multi-layer Glowing Aura
  if (bloom > 0.12) {
    const auraRad = 55 + bloom * 80;
    const ag1 = ctx.createRadialGradient(0, 0, 5, 0, 0, auraRad * 1.4);
    ag1.addColorStop(0, spec.colors.glow.replace(/[\d.]+\)$/, `${0.08 * bloom})`));
    ag1.addColorStop(1, "transparent");
    ctx.fillStyle = ag1;
    ctx.beginPath();
    ctx.arc(0, 0, auraRad * 1.4, 0, 2 * Math.PI);
    ctx.fill();

    const ag2 = ctx.createRadialGradient(0, 0, 3, 0, 0, auraRad);
    ag2.addColorStop(0, spec.colors.glow.replace(/[\d.]+\)$/, `${0.26 * bloom})`));
    ag2.addColorStop(0.6, spec.colors.glow.replace(/[\d.]+\)$/, `${0.10 * bloom})`));
    ag2.addColorStop(1, "transparent");
    ctx.fillStyle = ag2;
    ctx.beginPath();
    ctx.arc(0, 0, auraRad, 0, 2 * Math.PI);
    ctx.fill();

    // Rotating sparkle rays
    if (bloom > 0.35) {
      ctx.save();
      ctx.rotate(time * 0.4);
      for (let r = 0; r < 8; r++) {
        const ra = (r / 8) * Math.PI * 2;
        const rLen = auraRad * 0.65 * bloom;
        const rg = ctx.createLinearGradient(Math.cos(ra) * 6, Math.sin(ra) * 6, Math.cos(ra) * rLen, Math.sin(ra) * rLen);
        rg.addColorStop(0, spec.colors.glow.replace(/[\d.]+\)$/, `${0.18 * bloom})`));
        rg.addColorStop(1, "transparent");
        ctx.strokeStyle = rg;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ra) * 6, Math.sin(ra) * 6);
        ctx.lineTo(Math.cos(ra) * rLen, Math.sin(ra) * rLen);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // 2. Draw Petals
  if (spec.id === "lily") {
    const maxPL = 42 + bloom * 78;
    const maxPW = 14 + bloom * 32;

    const outerBloom = clamp(bloom * 1.15, 0.08, 1);
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.rotate((i * 2 * Math.PI) / 3 + Math.PI / 6);
      ctx.scale(0.22 + outerBloom * 0.78, 0.22 + outerBloom * 0.78);
      drawLilyPetal(ctx, maxPL * 0.95, maxPW * 0.85, outerBloom, spec, true, i, time);
      ctx.restore();
    }

    const innerBloom = clamp(bloom * 1.30, 0.06, 1);
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.rotate((i * 2 * Math.PI) / 3 - Math.PI / 6);
      ctx.scale(0.25 + innerBloom * 0.75, 0.25 + innerBloom * 0.75);
      drawLilyPetal(ctx, maxPL, maxPW, innerBloom, spec, false, i + 3, time);
      ctx.restore();
    }

    // Lily Throat, Stamens & Pistil
    const throatG = ctx.createRadialGradient(0, 0, 1, 0, 0, 18);
    throatG.addColorStop(0, spec.colors.petalThroatDeep);
    throatG.addColorStop(0.6, spec.colors.petalThroat);
    throatG.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, 2 * Math.PI);
    ctx.fillStyle = throatG;
    ctx.fill();

    const stL = 38 + bloom * 44;
    for (let s = 0; s < 6; s++) {
      const sA = (s * Math.PI * 2) / 6 + Math.PI / 12;
      const sw = Math.sin(time * 1.2 + s * 1.1) * 4 * bloom;
      ctx.save();
      ctx.rotate(sA);
      ctx.strokeStyle = spec.colors.filament || "#d9f99d";
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.shadowColor = "#84cc16";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(sw, -stL * 0.55, sw * 1.2, -stL);
      ctx.stroke();

      // T-shaped anther with golden pollen
      ctx.fillStyle = spec.colors.anther || "#9a3412";
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(sw * 1.2, -stL, 4.2, 2.4, 0, 0, Math.PI * 2);
      ctx.fill();

      if (bloom > 0.45) {
        for (let pd = 0; pd < 3; pd++) {
          ctx.beginPath();
          ctx.arc(sw * 1.2 + (pd - 1) * 2.2, -stL - 1.4, 1.0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(254,240,138,${0.7 * bloom})`;
          ctx.shadowBlur = 3;
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // Pistil
    ctx.save();
    ctx.fillStyle = spec.colors.stigmaHead || "#166534";
    ctx.beginPath();
    ctx.ellipse(0, -stL * 0.5, 2.8, stL * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4ade80";
    ctx.beginPath();
    ctx.arc(0, -stL * 0.98, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

  } else {
    // Other species: Rose, Sakura, Sunflower, Lotus, Cosmic, Tulip
    const layers = spec.petalLayers || 2;
    const totalPetals = spec.petalCount || 10;
    const maxPL = 36 + bloom * 66;
    const maxPW = 12 + bloom * 30;

    for (let l = 0; l < layers; l++) {
      const layerRatio = (l + 1) / layers;
      const petalsInLayer = Math.round(totalPetals / layers);
      const layerBloom = clamp(bloom * 1.22 - (1 - layerRatio) * 0.35, 0.04, 1);
      const pL = maxPL * (0.62 + layerRatio * 0.38);
      const pW = maxPW * (0.62 + layerRatio * 0.38);
      const laOff = (l * Math.PI) / petalsInLayer;

      for (let p = 0; p < petalsInLayer; p++) {
        ctx.save();
        ctx.rotate((p * 2 * Math.PI) / petalsInLayer + laOff);
        ctx.scale(0.18 + layerBloom * 0.82, 0.18 + layerBloom * 0.82);
        drawGenericPetal(ctx, pL, pW, layerBloom, spec, l, l * petalsInLayer + p, time);
        ctx.restore();
      }
    }

    // Species Center Core
    if (spec.id === "sunflower") {
      const discR = 24 + bloom * 22;
      const dg = ctx.createRadialGradient(0, 0, 0, 0, 0, discR);
      dg.addColorStop(0, "#292524");
      dg.addColorStop(0.6, "#451a03");
      dg.addColorStop(1, "#78350f");
      ctx.beginPath();
      ctx.arc(0, 0, discR, 0, 2 * Math.PI);
      ctx.fillStyle = dg;
      ctx.shadowColor = "#78350f";
      ctx.shadowBlur = 10;
      ctx.fill();

      // Fibonacci disc florets
      const floretCount = Math.floor(35 + bloom * 45);
      for (let s = 0; s < floretCount; s++) {
        const sa = s * 2.39996;
        const sr = Math.sqrt(s / floretCount) * (discR * 0.92);
        const fB = clamp((bloom - (1 - s / floretCount) * 0.5) * 2, 0, 1);
        const fR = 1.4 + fB * 1.4;
        const fg = ctx.createRadialGradient(Math.cos(sa) * sr, Math.sin(sa) * sr, 0, Math.cos(sa) * sr, Math.sin(sa) * sr, fR * 2);
        fg.addColorStop(0, `rgba(253,224,71,${0.5 + fB * 0.5})`);
        fg.addColorStop(1, `rgba(180,120,0,${0.2 * fB})`);
        ctx.beginPath();
        ctx.arc(Math.cos(sa) * sr, Math.sin(sa) * sr, fR, 0, Math.PI * 2);
        ctx.fillStyle = fg;
        ctx.shadowColor = "rgba(250,204,21,0.6)";
        ctx.shadowBlur = 3;
        ctx.fill();
      }
    } else if (spec.id === "cosmic") {
      const cR = 18 + bloom * 16;
      const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, cR);
      cg.addColorStop(0, "#f0abfc");
      cg.addColorStop(0.3, "#a855f7");
      cg.addColorStop(0.7, "#3b82f6");
      cg.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(0, 0, cR, 0, 2 * Math.PI);
      ctx.fillStyle = cg;
      ctx.shadowColor = "#a855f7";
      ctx.shadowBlur = 24;
      ctx.fill();

      // 3 Orbital energy rings
      for (let ring = 0; ring < 3; ring++) {
        const rR = cR * (0.5 + ring * 0.35);
        const rA = 0.15 + ring * 0.08 + bloom * 0.2;
        ctx.save();
        ctx.rotate(time * (0.5 + ring * 0.3) * (ring % 2 === 0 ? 1 : -1));
        ctx.beginPath();
        ctx.arc(0, 0, rR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ring === 0 ? "240,171,252" : ring === 1 ? "59,130,246" : "6,182,212"},${rA})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }
    } else {
      const cR = 14 + bloom * 16;
      const cg = ctx.createRadialGradient(0, 0, 1, 0, 0, cR);
      cg.addColorStop(0, "#fff");
      cg.addColorStop(0.3, spec.colors.petalThroatDeep || spec.colors.petalThroat);
      cg.addColorStop(0.8, spec.colors.petalBody);
      cg.addColorStop(1, "#1e293b");
      ctx.beginPath();
      ctx.arc(0, 0, cR, 0, 2 * Math.PI);
      ctx.fillStyle = cg;
      ctx.shadowColor = spec.colors.petalThroat;
      ctx.shadowBlur = 12;
      ctx.fill();

      // Pollen dots
      const sC = Math.floor(8 + bloom * 24);
      for (let s = 0; s < sC; s++) {
        const sa = s * 2.39996;
        const sr = Math.sqrt(s / sC) * (cR * 0.85);
        ctx.beginPath();
        ctx.arc(Math.cos(sa) * sr, Math.sin(sa) * sr, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = "#fef08a";
        ctx.shadowColor = "#fef08a";
        ctx.shadowBlur = 3;
        ctx.fill();
      }
    }
  }
}

/** Render 1 Single Flower Plant (Soil Mound, Stem, Foliage, Blossom Head) */
function drawIndividualFlowerPlant(ctx, flower, isSelected, w, h) {
  const spec = SPECIES_CATALOG[flower.speciesId] || SPECIES_CATALOG.lily;
  const flowerScale = flower.scale || 0.65;

  const rootX = flower.x * w;
  const rootY = flower.y * h;

  const refDim = Math.min(w, h);
  const minStem = refDim * 0.14 * flowerScale;
  const maxStem = refDim * 0.38 * flowerScale;
  const stemHeightPx = minStem + flower.stemHeight * (maxStem - minStem);

  const swayOffset = Math.sin(windPhase + flower.id) * (8 * flowerScale);
  const headX = rootX + swayOffset;
  const headY = rootY - stemHeightPx;

  flower.headX = headX;
  flower.headY = headY;

  ctx.save();

  // 1. Soil Mound at Ground Base
  const soilGrad = ctx.createRadialGradient(rootX, rootY, 0, rootX, rootY, 32 * flowerScale);
  soilGrad.addColorStop(0, "rgba(41,25,22,0.85)");
  soilGrad.addColorStop(0.6, "rgba(28,16,10,0.5)");
  soilGrad.addColorStop(1, "transparent");
  ctx.beginPath();
  ctx.ellipse(rootX, rootY, 36 * flowerScale, 10 * flowerScale, 0, 0, Math.PI * 2);
  ctx.fillStyle = soilGrad;
  ctx.fill();

  // Root tendrils
  for (let r = 0; r < 3; r++) {
    const angle = (Math.PI / 4) + (r / 2) * (Math.PI / 2);
    const rLen = (14 + r * 6) * flowerScale;
    ctx.beginPath();
    ctx.moveTo(rootX, rootY);
    ctx.quadraticCurveTo(rootX + Math.cos(angle) * rLen * 0.5, rootY + rLen * 0.5, rootX + Math.cos(angle) * rLen, rootY + rLen);
    ctx.strokeStyle = "rgba(78,46,32,0.5)";
    ctx.lineWidth = 1.8 * flowerScale;
    ctx.stroke();
  }

  // 2. Stem Shadow
  ctx.lineWidth = (10 + (1 - flower.stemHeight) * 3) * flowerScale;
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.moveTo(rootX + 3, rootY + 3);
  ctx.quadraticCurveTo((rootX + headX) / 2 + swayOffset + 3, (rootY + headY) / 2 + 3, headX + 3, headY + 3);
  ctx.stroke();

  // Main Stalk
  ctx.lineWidth = (6 + (1 - flower.stemHeight) * 2) * flowerScale;
  const stemGrad = ctx.createLinearGradient(rootX, rootY, headX, headY);
  stemGrad.addColorStop(0.0, spec.colors.stemDark || "#064e3b");
  stemGrad.addColorStop(0.5, spec.colors.stemMid || "#047857");
  stemGrad.addColorStop(1.0, spec.colors.stemLight || "#10b981");

  ctx.strokeStyle = stemGrad;
  ctx.shadowColor = "rgba(16, 185, 129, 0.45)";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(rootX, rootY);
  ctx.quadraticCurveTo((rootX + headX) / 2 + swayOffset, (rootY + headY) / 2, headX, headY);
  ctx.stroke();

  // Specular Highlight Stripe
  ctx.lineWidth = 1.8 * flowerScale;
  ctx.strokeStyle = "rgba(167, 243, 208, 0.25)";
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(rootX - 1.5, rootY);
  ctx.quadraticCurveTo((rootX + headX) / 2 + swayOffset - 1.5, (rootY + headY) / 2, headX - 1.5, headY);
  ctx.stroke();

  // 3. Foliage Leaves with Venation
  const leafCount = Math.floor(2 + flower.stemHeight * 4);
  for (let i = 1; i <= leafCount; i++) {
    const t = i / (leafCount + 1);
    const lx = (1 - t) * rootX + t * headX;
    const ly = (1 - t) * rootY + t * headY;

    const side = i % 2 === 0 ? 1 : -1;
    const leafLen = (26 + flower.stemHeight * 22) * Math.min(1, (flower.stemHeight + 0.3) * 1.4) * flowerScale;
    const leafWid = leafLen * 0.42;
    const leafAngle = (side * Math.PI) / 2.8 + Math.sin(windPhase * 0.9 + i * 1.3) * 0.14;

    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(leafAngle);

    // Leaf Drop Shadow
    ctx.beginPath();
    ctx.moveTo(2, 2);
    ctx.bezierCurveTo(leafWid + 2, -leafWid + 2, leafLen - leafWid + 2, -leafWid * 0.5 + 2, leafLen + 2, 2);
    ctx.bezierCurveTo(leafWid * 0.5 + 2, leafWid + 2, leafWid * 0.5 + 2, leafWid + 2, 2, 2);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fill();

    // Leaf Body
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(leafWid, -leafWid, leafLen - leafWid, -leafWid * 0.5, leafLen, 0);
    ctx.bezierCurveTo(leafWid * 0.5, leafWid, leafWid * 0.5, leafWid, 0, 0);

    const leafGrad = ctx.createLinearGradient(0, 0, leafLen, 0);
    leafGrad.addColorStop(0.0, spec.colors.leafDark || "#064e3b");
    leafGrad.addColorStop(0.5, spec.colors.leafMid || "#15803d");
    leafGrad.addColorStop(1.0, spec.colors.stemLight || "#34d399");

    ctx.fillStyle = leafGrad;
    ctx.shadowColor = "rgba(16, 185, 129, 0.35)";
    ctx.shadowBlur = 6;
    ctx.fill();

    // Leaf Surface Shine
    ctx.globalAlpha = 0.28;
    const shG = ctx.createLinearGradient(0, -leafWid * 0.5, leafLen * 0.4, leafWid * 0.3);
    shG.addColorStop(0, "rgba(255,255,255,0.6)");
    shG.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(leafWid * 0.5, -leafWid * 0.5, leafLen * 0.4, -leafWid * 0.3, leafLen * 0.5, 0);
    ctx.lineTo(0, 0);
    ctx.fillStyle = shG;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Midrib
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(leafLen * 0.88, 0);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.36)";
    ctx.lineWidth = 1.4;
    ctx.shadowBlur = 0;
    ctx.stroke();

    // Side Veins
    for (let v = 1; v <= 3; v++) {
      const vt = v / 4.5;
      const vx = leafLen * vt;
      const vLen = leafWid * (1 - vt) * 0.80;
      ctx.strokeStyle = `rgba(255,255,255,${0.15 - v * 0.03})`;
      ctx.lineWidth = 0.8;
      for (const sv of [1, -1]) {
        ctx.beginPath();
        ctx.moveTo(vx, 0);
        ctx.quadraticCurveTo(vx + leafLen * 0.08, sv * vLen * 0.5, vx + leafLen * 0.12, sv * vLen);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // 4. Blossom Head
  ctx.save();
  ctx.translate(headX, headY);

  const headScale = (0.36 + flower.stemHeight * 0.26 + flower.bloom * 0.38) * flowerScale;
  ctx.scale(headScale, headScale);

  drawSingleFlowerHead(ctx, flower.bloom, flower.stemHeight, spec, globalTime);

  ctx.restore();

  // 5. Dew Drops
  if (flower.bloom > 0.55) {
    for (let d = 0; d < 4; d++) {
      const da = (d / 4) * Math.PI * 2 + globalTime * 0.1;
      const dr = 24 * flowerScale;
      const dx = headX + Math.cos(da) * dr;
      const dy = headY + Math.sin(da) * dr * 0.6;
      const dS = 2.0 * flowerScale;
      ctx.beginPath();
      ctx.arc(dx, dy, dS, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.shadowColor = "rgba(200,230,255,0.7)";
      ctx.shadowBlur = 4;
      ctx.fill();
    }
  }

  // 6. Glowing Selection Halo & Label if Selected
  if (isSelected) {
    const auraRad = (30 + Math.sin(dragAuraPulse) * 4) * flowerScale;
    ctx.beginPath();
    ctx.arc(rootX, rootY, auraRad, 0, 2 * Math.PI);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 10;
    ctx.stroke();

    ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#fef08a";
    ctx.textAlign = "center";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 6;
    ctx.fillText(`✨ ${spec.icon} ${t("tagSelecting")} #${flower.id}`, headX, headY - (52 * headScale) - 8);
  }

  ctx.restore();
}

// =========================================================================
// 10. RENDER AR FRAME
// =========================================================================
function renderARFrame() {
  if (!arCtx || !arCanvas) return;

  const w = window.innerWidth || 1280;
  const h = window.innerHeight || 720;

  if (arCanvas.width !== w || arCanvas.height !== h) {
    arCanvas.width = w;
    arCanvas.height = h;
  }

  arCtx.clearRect(0, 0, w, h);

  windPhase += 0.022;
  globalTime += 0.016;
  dragAuraPulse += 0.08;

  // Smooth parameter lerp for all flowers
  flowers.forEach((flower) => {
    flower.stemHeight = lerp(flower.stemHeight, flower.targetStemHeight, 0.12);
    flower.bloom = lerp(flower.bloom, flower.targetBloom, 0.12);
    flower.x = lerp(flower.x, flower.targetX, 0.18);
    flower.y = lerp(flower.y, flower.targetY, 0.18);

    // Spawn falling petals if bloom is high
    const spec = SPECIES_CATALOG[flower.speciesId] || SPECIES_CATALOG.lily;
    if (flower.bloom > 0.55 && petalFallParticles.length < MAX_PETAL_FALL && Math.random() < 0.03) {
      petalFallParticles.push(makePetalFall(flower.headX || flower.x * w, flower.headY || flower.y * h, spec));
    }
  });

  // HUD updates
  const selectedList = getSelectedFlowers();
  if (selectedList.length > 0) {
    const avgGrow = selectedList.reduce((acc, f) => acc + f.stemHeight, 0) / selectedList.length;
    const avgBloom = selectedList.reduce((acc, f) => acc + f.bloom, 0) / selectedList.length;
    const avgScale = selectedList.reduce((acc, f) => acc + (f.scale || 0.65), 0) / selectedList.length;

    const growPercent = Math.round(avgGrow * 100);
    const bloomPercent = Math.round(avgBloom * 100);
    const scalePercent = Math.round(avgScale * 100);

    if (growBar) growBar.style.width = `${growPercent}%`;
    if (bloomBar) bloomBar.style.width = `${bloomPercent}%`;
    if (growValueText) growValueText.textContent = `${growPercent}%`;
    if (bloomValueText) bloomValueText.textContent = `${bloomPercent}%`;
    if (stemValueText) stemValueText.textContent = `${growPercent}% (${scalePercent}%)`;
    if (petalValueText) petalValueText.textContent = `${bloomPercent}%`;

    if (flowerActiveName) {
      if (selectedList.length === 1) {
        const spec = SPECIES_CATALOG[selectedList[0].speciesId] || SPECIES_CATALOG.lily;
        flowerActiveName.textContent = `${spec.icon} ${getSpeciesName(spec)}:`;
      } else {
        flowerActiveName.textContent = `✨ ${selectedList.length} ${t("selectedLabel")}:`;
      }
    }
  }

  // 1. Hand tracking skeleton arcs
  if (gestureTrackingEnabled) {
    for (const hand of activeHandsData) {
      const isLeft = hand.role === "left";
      const primaryColor = isLeft ? "#34d399" : "#f472b6";
      const handLabel = isLeft ? t("growHeader") : t("bloomHeader");

      arCtx.save();
      arCtx.lineWidth = 4;
      arCtx.strokeStyle = primaryColor;
      arCtx.shadowColor = primaryColor;
      arCtx.shadowBlur = 10;
      arCtx.beginPath();
      arCtx.moveTo(hand.thumbScreenX, hand.thumbScreenY);
      arCtx.lineTo(hand.indexScreenX, hand.indexScreenY);
      arCtx.stroke();

      arCtx.beginPath();
      arCtx.arc(hand.thumbScreenX, hand.thumbScreenY, 7, 0, 2 * Math.PI);
      arCtx.fillStyle = "#ffffff";
      arCtx.fill();

      arCtx.beginPath();
      arCtx.arc(hand.indexScreenX, hand.indexScreenY, 7, 0, 2 * Math.PI);
      arCtx.fillStyle = primaryColor;
      arCtx.fill();

      const midX = (hand.thumbScreenX + hand.indexScreenX) / 2;
      const midY = (hand.thumbScreenY + hand.indexScreenY) / 2;
      arCtx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
      arCtx.fillStyle = "#ffffff";
      arCtx.shadowColor = "#000000";
      arCtx.shadowBlur = 6;
      arCtx.textAlign = "center";
      arCtx.fillText(handLabel, midX, midY - 18);
      arCtx.restore();
    }
  }

  // 2. Pollen & Ambient Particles
  updateAndDrawParticles(arCtx, w, h);

  // 3. Draw All Individual Flower Plants
  flowers.forEach((flower) => {
    drawIndividualFlowerPlant(arCtx, flower, selectedFlowerIds.has(flower.id), w, h);
  });
}

// =========================================================================
// 11. SNAPSHOT GENERATOR
// =========================================================================
async function takeSnapshot() {
  playShutterSound();

  flashOverlay.classList.add("flashing");
  setTimeout(() => flashOverlay.classList.remove("flashing"), 120);

  const offCanvas = document.createElement("canvas");
  const offCtx = offCanvas.getContext("2d");

  const w = arCanvas.width || 1280;
  const h = arCanvas.height || 720;

  offCanvas.width = w;
  offCanvas.height = h;

  // Video frame
  offCtx.save();
  if (isMirrored) {
    offCtx.translate(w, 0);
    offCtx.scale(-1, 1);
    offCtx.drawImage(video, 0, 0, w, h);
  } else {
    offCtx.drawImage(video, 0, 0, w, h);
  }
  offCtx.restore();

  // AR Canvas
  if (arCanvas) {
    offCtx.drawImage(arCanvas, 0, 0, w, h);
  }

  // Watermark
  offCtx.fillStyle = "rgba(15, 23, 42, 0.88)";
  offCtx.roundRect ? offCtx.roundRect(24, 24, 480, 56, 24) : offCtx.fillRect(24, 24, 480, 56);
  offCtx.fill();

  offCtx.fillStyle = "#fbcfe8";
  offCtx.font = "bold 22px 'Plus Jakarta Sans', sans-serif";
  offCtx.fillText(t("watermarkTitle"), 48, 60);

  const dataUrl = offCanvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `flora_ar_${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToast(t("photoSaved"));
}

// =========================================================================
// 12. DRAGGABLE HUD & SCREEN TOUCH
// =========================================================================
function setupDraggableHUD(element) {
  if (!element) return;

  let isHudDragging = false;
  let startX = 0, startY = 0, elemLeft = 0, elemTop = 0;

  const onStart = (e) => {
    isHudDragging = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    startX = clientX;
    startY = clientY;

    const rect = element.getBoundingClientRect();
    elemLeft = rect.left;
    elemTop = rect.top;

    element.style.right = "auto";
    element.style.bottom = "auto";
    element.style.left = `${elemLeft}px`;
    element.style.top = `${elemTop}px`;

    e.stopPropagation();
  };

  const onMove = (e) => {
    if (!isHudDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const dx = clientX - startX;
    const dy = clientY - startY;

    const maxLeft = window.innerWidth - element.offsetWidth - 10;
    const maxTop = window.innerHeight - element.offsetHeight - 80;

    element.style.left = `${Math.max(10, Math.min(maxLeft, elemLeft + dx))}px`;
    element.style.top = `${Math.max(60, Math.min(maxTop, elemTop + dy))}px`;

    e.stopPropagation();
  };

  const onEnd = () => {
    if (isHudDragging) {
      isHudDragging = false;
      playBotanicalChime(3, 0.12);
    }
  };

  element.addEventListener("mousedown", onStart);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onEnd);

  element.addEventListener("touchstart", onStart, { passive: false });
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("touchend", onEnd, { passive: false });
}

function setupScreenInteraction() {
  setupDraggableHUD(meterGrow);
  setupDraggableHUD(meterBloom);

  let lastTapTime = 0;
  let lastTapX = 0;
  let lastTapY = 0;

  const handleDoubleTapCheck = (clientX, clientY) => {
    const now = performance.now();
    const dt = now - lastTapTime;
    const dDist = Math.hypot(clientX - lastTapX, clientY - lastTapY);
    lastTapTime = now;
    lastTapX = clientX;
    lastTapY = clientY;

    if (dt > 40 && dt < 380 && dDist < 50) {
      lastTapTime = 0;
      toggleGestureTracking(clientX, clientY);
      return true;
    }
    return false;
  };

  const handlePointerStart = (clientX, clientY, target) => {
    if (target.closest(".controls-dock") || target.closest(".top-bar") || target.closest(".overlay") || target.closest(".hud-meter") || target.closest(".flowers-chips-bar") || target.closest(".species-drawer")) {
      return;
    }

    if (handleDoubleTapCheck(clientX, clientY)) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    let closestFlower = null;
    let minD = 240;

    flowers.forEach((flower) => {
      const rootX = flower.x * w;
      const rootY = flower.y * h;
      const headX = flower.headX || rootX;
      const headY = flower.headY || rootY - 140;

      const dRoot = Math.hypot(clientX - rootX, clientY - rootY);
      const dHead = Math.hypot(clientX - headX, clientY - headY);
      const dMin = Math.min(dRoot, dHead);

      if (dMin < minD) {
        minD = dMin;
        closestFlower = flower;
      }
    });

    if (closestFlower) {
      toggleSelectFlower(closestFlower.id, false);
      isDragging = true;
      dragFlowerId = closestFlower.id;
      touchOffsetX = (clientX / w) - closestFlower.x;
      touchOffsetY = (clientY / h) - closestFlower.y;
    } else {
      const selectedList = getSelectedFlowers();
      if (selectedList.length > 0) {
        const primary = selectedList[0];
        isDragging = true;
        dragFlowerId = primary.id;
        touchOffsetX = 0;
        touchOffsetY = 0;
        primary.targetX = Math.max(0.08, Math.min(0.92, clientX / w));
        primary.targetY = Math.max(0.25, Math.min(0.98, clientY / h));
      }
    }
  };

  const handlePointerMove = (clientX, clientY) => {
    if (!isDragging || dragFlowerId === null || isPinching) return;
    const flower = flowers.find((f) => f.id === dragFlowerId);
    if (flower) {
      flower.targetX = Math.max(0.08, Math.min(0.92, (clientX / window.innerWidth) - touchOffsetX));
      flower.targetY = Math.max(0.25, Math.min(0.98, (clientY / window.innerHeight) - touchOffsetY));
    }
  };

  const handlePointerEnd = () => {
    if (isDragging) {
      isDragging = false;
      const flower = flowers.find((f) => f.id === dragFlowerId);
      if (flower && !isPinching) {
        spawnBurst(flower.x * window.innerWidth, flower.y * window.innerHeight, 14, "#f59e0b");
        playBotanicalChime(6, 0.2);
        showToast(t("toastPlaced"));
      }
      dragFlowerId = null;
    }
  };

  window.addEventListener("pointerdown", (e) => handlePointerStart(e.clientX, e.clientY, e.target));
  window.addEventListener("pointermove", (e) => handlePointerMove(e.clientX, e.clientY));
  window.addEventListener("pointerup", handlePointerEnd);
  window.addEventListener("pointercancel", handlePointerEnd);

  // Pinch Zoom on Touch
  window.addEventListener("touchstart", (e) => {
    if (e.target.closest(".controls-dock") || e.target.closest(".top-bar") || e.target.closest(".overlay") || e.target.closest(".hud-meter") || e.target.closest(".flowers-chips-bar") || e.target.closest(".species-drawer")) {
      return;
    }
    e.preventDefault();

    if (e.touches.length === 2) {
      isPinching = true;
      isDragging = false;
      initialPinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const selectedList = getSelectedFlowers();
      if (selectedList.length > 0) {
        initialFlowerScale = selectedList[0].scale || 0.65;
      }
    } else if (e.touches.length === 1) {
      handlePointerStart(e.touches[0].clientX, e.touches[0].clientY, e.target);
    }
  }, { passive: false });

  window.addEventListener("touchmove", (e) => {
    if (e.target.closest(".controls-dock") || e.target.closest(".top-bar") || e.target.closest(".overlay") || e.target.closest(".hud-meter") || e.target.closest(".flowers-chips-bar") || e.target.closest(".species-drawer")) {
      return;
    }
    e.preventDefault();

    if (e.touches.length === 2 && initialPinchDist) {
      const curDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = curDist / initialPinchDist;
      const selectedList = getSelectedFlowers();
      if (selectedList.length > 0) {
        const newScale = Math.min(2.8, Math.max(0.30, initialFlowerScale * ratio));
        selectedList.forEach((f) => (f.scale = newScale));
        showToast(t("toastSize", Math.round(newScale * 100)));
      }
    } else if (e.touches.length === 1) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });

  window.addEventListener("touchend", (e) => {
    if (e.touches.length < 2 && isPinching) {
      isPinching = false;
      initialPinchDist = null;
      const selectedList = getSelectedFlowers();
      if (selectedList.length > 0) {
        playBotanicalChime(5, 0.2);
        showToast(t("toastSize", Math.round((selectedList[0].scale || 0.65) * 100)));
      }
    }
    if (e.touches.length === 0) {
      handlePointerEnd();
    }
  }, { passive: false });

  // Mouse wheel zoom
  window.addEventListener("wheel", (e) => {
    if (e.target.closest(".controls-dock") || e.target.closest(".species-drawer") || e.target.closest(".hud-meter")) return;
    const selectedList = getSelectedFlowers();
    if (selectedList.length === 0) return;
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    zoomSelectedFlowers(delta);
  }, { passive: true });
}

// =========================================================================
// 13. CAMERA & RESIZE
// =========================================================================
async function startCamera(facing = currentFacingMode) {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Camera not supported. Please access via HTTPS!");
  }

  const constraints = {
    video: {
      facingMode: facing,
      width: { ideal: 1280 },
      height: { ideal: 720 },
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
    btnMirror.classList.add("active");
  } else {
    video.classList.add("unmirrored");
    btnMirror.classList.remove("active");
  }
}

function resizeARCanvas() {
  if (!arCanvas) return;
  arCanvas.width = window.innerWidth;
  arCanvas.height = window.innerHeight;
}

function onFullscreenChange() {
  const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
  if (btnFullscreen) {
    if (isFull) {
      btnFullscreen.classList.add("active");
      btnFullscreen.textContent = t("btnFullscreenExit");
      document.body.classList.add("is-fullscreen");
    } else {
      btnFullscreen.classList.remove("active");
      btnFullscreen.textContent = t("btnFullscreen");
      document.body.classList.remove("is-fullscreen");
    }
  }
  resizeARCanvas();
}

document.addEventListener("fullscreenchange", onFullscreenChange);
document.addEventListener("webkitfullscreenchange", onFullscreenChange);

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
    if (btnFullscreen) {
      btnFullscreen.classList.add("active");
      btnFullscreen.textContent = t("btnFullscreenExit");
    }
    document.body.classList.add("is-fullscreen");
    playBotanicalChime(4, 0.2);
    showToast("⛶ Fullscreen Locked");
  } else {
    if (doc.exitFullscreen) {
      doc.exitFullscreen().catch(() => {});
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    }
    if (btnFullscreen) {
      btnFullscreen.classList.remove("active");
      btnFullscreen.textContent = t("btnFullscreen");
    }
    document.body.classList.remove("is-fullscreen");
    playBotanicalChime(2, 0.18);
    showToast("Exit Fullscreen");
  }
}

// =========================================================================
// 14. MAIN LOOP
// =========================================================================
function loop() {
  if (!isRunning) return;

  try {
    if (gestureTrackingEnabled && handLandmarker && video && video.readyState >= 2 && video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      const ts = performance.now();
      const handResult = handLandmarker.detectForVideo(video, ts);
      if (handResult) {
        processHandGestures(handResult);
      }
    }
  } catch (err) {
    console.warn("Hand landmarker frame warning:", err);
  }

  try {
    renderARFrame();
  } catch (err) {
    console.error("Render frame error:", err);
  }

  requestAnimationFrame(loop);
}

// =========================================================================
// 15. INITIALIZATION & EVENT LISTENERS
// =========================================================================
async function init() {
  initParticles();
  initSpeciesDrawer();
  renderFlowerChips();
  setupScreenInteraction();
  updateUILanguage();
  window.addEventListener("resize", resizeARCanvas);
  resizeARCanvas();

  requestAnimationFrame(loop);

  try {
    overlayTitle.textContent = "Loading AI Vision...";
    overlayDesc.textContent = "MediaPipe Vision Models loading...";

    const fileset = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );

    overlayDesc.textContent = "Initializing Flora AR Studio Engine...";

    handLandmarker = await HandLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
    });

    overlayTitle.textContent = t("overlayTitle");
    overlayDesc.textContent = t("overlayDesc");
    spinner.style.display = "none";
    startBtn.style.display = "inline-block";
    startBtn.textContent = t("startBtn");

    startCamera("user")
      .then(() => {
        loadingOverlay.classList.add("hidden");
        initAudio();
        resizeARCanvas();
      })
      .catch((err) => {
        console.warn("User interaction required:", err);
      });
  } catch (err) {
    console.error("Init error:", err);
    spinner.style.display = "none";
    overlayTitle.textContent = "Error Occurred";
    overlayDesc.textContent = "Could not load AI vision models or connect camera.";
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
    resizeARCanvas();
  } catch (err) {
    console.error(err);
    errorBanner.style.display = "block";
    errorBanner.innerText = err.message || String(err);
  }
});

btnAddFlower.addEventListener("click", () => {
  initAudio();
  openSpeciesDrawer();
});

if (btnSelectAll) {
  btnSelectAll.addEventListener("click", () => {
    initAudio();
    selectAllFlowers();
  });
}

btnCloseDrawer.addEventListener("click", () => {
  closeSpeciesDrawer();
});

btnDeleteFlower.addEventListener("click", () => {
  deleteSelectedFlowers();
});

if (btnLang) {
  btnLang.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "vi" : "en";
    updateUILanguage();
    playBotanicalChime(3, 0.18);
    showToast(currentLang === "en" ? "🌐 Switched to English 🇬🇧" : "🌐 Đã đổi sang Tiếng Việt 🇻🇳");
  });
}

if (btnZoomIn) {
  btnZoomIn.addEventListener("click", () => {
    zoomSelectedFlowers(+0.12);
  });
}

if (btnZoomOut) {
  btnZoomOut.addEventListener("click", () => {
    zoomSelectedFlowers(-0.12);
  });
}

btnGesture.addEventListener("click", () => {
  toggleGestureTracking();
});

btnSwitchCam.addEventListener("click", async () => {
  const targetMode = currentFacingMode === "user" ? "environment" : "user";
  try {
    await startCamera(targetMode);
    showToast(targetMode === "user" ? "📷 Front Camera" : "📸 Back Camera");
  } catch (err) {
    alert("Camera switch error: " + err.message);
  }
});

btnSnapshot.addEventListener("click", () => {
  takeSnapshot();
});

btnSound.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    btnSound.classList.add("active");
    btnSound.textContent = t("btnSound");
    playBotanicalChime(4, 0.2);
    showToast("Sound ON 🔊");
  } else {
    btnSound.classList.remove("active");
    btnSound.textContent = t("btnSoundOff");
    showToast("Muted 🔇");
  }
});

btnFullscreen.addEventListener("click", toggleFullscreen);

btnMirror.addEventListener("click", () => {
  isMirrored = !isMirrored;
  updateMirrorState();
});

init();
