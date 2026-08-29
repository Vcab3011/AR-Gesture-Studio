import {
  HandLandmarker,
  FaceLandmarker,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";

// =========================================================================
// 1. MEME MAPPING & GESTURE LABELS & INSTRUCTIONS
// =========================================================================
const GESTURE_MEMES = {
  default: {
    files: ["memes/pokercat.jpg"],
    label: "😐 Mặc định (Poker Cat)",
    desc: "Ngồi bình thường, hạ tay, không làm gì",
    isVideo: false,
  },
  rockstar: {
    files: ["memes/cat.jpg"],
    label: "🤘 Rockstar / Shaka",
    desc: "Giơ ngón cái + ngón út (hoặc ngón trỏ + ngón út 🤘)",
    isVideo: false,
  },
  oneFingerUp: {
    files: ["memes/profcat.jpg", "memes/professorcat.jpg"],
    label: "☝️ Giáo sư phát biểu",
    desc: "1 ngón trỏ chỉ lên trời (xa mặt)",
    isVideo: false,
  },
  fist: {
    files: ["memes/punchcat.jpg"],
    label: "👊 Cú đấm / Nắm đấm",
    desc: "Nắm chặt 4 ngón tay thành nắm đấm",
    isVideo: false,
  },
  shhh: {
    files: ["memes/shhcat.jpg"],
    label: "🤫 Suỵt im lặng",
    desc: "1 ngón trỏ đặt sát lên môi/miệng",
    isVideo: false,
  },
  twoFingersTogether: {
    files: [
      "memes/uwucat.jpg",
      "memes/uwucatt.jpg",
      "memes/fingers together muehehe .jpg",
    ],
    label: "👉👈 E thẹn / Muehehe",
    desc: "Đưa 2 tay lên, chạm 2 đầu ngón trỏ vào nhau",
    isVideo: false,
  },
  handCoverFace: {
    files: ["memes/hand cover face .jpg"],
    label: "🙈 Che mặt / Bắt cóc",
    desc: "1 bàn tay che kín mặt/miệng",
    isVideo: false,
  },
  crashOutCat: {
    files: ["memes/crashout cat .jpg"],
    label: "😱 Hoảng loạn / Crash out",
    desc: "2 tay đặt sát 2 bên má/thái dương",
    isVideo: false,
  },
  twoHandsOnHead: {
    files: ["memes/two hands on head .jpg"],
    label: "🤯 Ôm đầu tuyệt vọng",
    desc: "2 bàn tay đưa lên ôm trên đỉnh đầu",
    isVideo: false,
  },
  handStretchedOut: {
    files: ["memes/hand stretched out, palm facing up .jpg"],
    label: "🫴 Xòe tay xin tiền",
    desc: "1 bàn tay xòe mở ngửa hướng về camera",
    isVideo: false,
  },
  sideEyeCat: {
    files: ["memes/side eye cat.jpg"],
    label: "👀 Liếc xéo (Side eye)",
    desc: "Quay đầu sang trái hoặc phải",
    isVideo: false,
  },
  sideEyeDownCat: {
    files: ["memes/side eye.png"],
    label: "😒 Phán xét (Nhíu mày)",
    desc: "Nhíu lông mày / cau mày lại để phán xét",
    isVideo: false,
  },
  huhCat: {
    files: ["memes/huh.png"],
    label: "😲 Huh?! Ngạc nhiên",
    desc: "Mở to mắt & há to mồm (không giơ tay)",
    isVideo: false,
  },
  mouthOpenCat: {
    files: ["memes/laugh and point .jpg"],
    label: "🤣 Cười lớn chỉ trỏ",
    desc: "Há to mồm cười + giơ 1 tay lên",
    isVideo: false,
  },
  shrugCat: {
    files: ["memes/iunno cat.jpg"],
    label: "🤷 Nhún vai (I dunno)",
    desc: "Xòe 2 bàn tay rộng sang 2 bên vai",
    isVideo: false,
  },
  danceCat: {
    files: ["memes/two palms up.mov"],
    label: "💃 Nhảy múa (Dance cat)",
    desc: "2 tay mở: 1 tay ở trên cao, 1 tay ở dưới thấp",
    isVideo: true,
  },
  spinCat: {
    files: ["memes/spin cat.mov"],
    label: "🔄 Xoay tròn (Spin cat)",
    desc: "Xoay tròn ghế / xoay camera liên tục",
    isVideo: true,
  },
};

// =========================================================================
// 2. CONFIGURATION & SENSITIVITY THRESHOLDS
// =========================================================================
const STABLE_FRAMES_REQUIRED = 3;
const DEFAULT_FALLBACK_MS = 650;
const FACE_STALE_MS = 2500; // Increased to hold hand-over-face longer

// Head pose & Facial expression thresholds
const SIDE_EYE_YAW_DEG = 13.0;
const BROW_DOWN_THRESHOLD = 0.22; // Eyebrow furrow threshold for Phán xét
const HUH_JAW_THRESHOLD = 0.18;
const MOUTH_OPEN_JAW_THRESHOLD = 0.25;

// Hand skeleton connections
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

const LAYOUT_MODES = [
  { id: "layout-split", name: "Chia đôi" },
  { id: "layout-pip-cam", name: "Meme To + Cam Nhỏ" },
  { id: "layout-pip-meme", name: "Cam To + Meme Nhỏ" },
];
let currentLayoutIndex = 0;

// =========================================================================
// 3. DOM ELEMENTS
// =========================================================================
const appContainer = document.getElementById("appContainer");
const cameraPane = document.getElementById("cameraPane");
const memePane = document.getElementById("memePane");
const video = document.getElementById("video");
const canvas = document.getElementById("overlayCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const memeImg = document.getElementById("memeImg");
const memeVideo = document.getElementById("memeVideo");
const badgeText = document.getElementById("badgeText");
const gestureBadge = document.getElementById("gestureBadge");
const debugHud = document.getElementById("debugHud");
const tapHint = document.getElementById("tapHint");
const flashOverlay = document.getElementById("flashOverlay");
const toast = document.getElementById("toast");

const gestureDrawer = document.getElementById("gestureDrawer");
const gestureGrid = document.getElementById("gestureGrid");
const btnCloseDrawer = document.getElementById("btnCloseDrawer");

const loadingOverlay = document.getElementById("loadingOverlay");
const spinner = document.getElementById("spinner");
const overlayTitle = document.getElementById("overlayTitle");
const overlayDesc = document.getElementById("overlayDesc");
const startBtn = document.getElementById("startBtn");
const errorBanner = document.getElementById("errorBanner");

const btnFullscreen = document.getElementById("btnFullscreen");
const btnPhoneMode = document.getElementById("btnPhoneMode");
const btnSwitchCam = document.getElementById("btnSwitchCam");
const btnLayout = document.getElementById("btnLayout");
const btnSnapshot = document.getElementById("btnSnapshot");
const btnGuide = document.getElementById("btnGuide");
const btnSound = document.getElementById("btnSound");
const btnMirror = document.getElementById("btnMirror");
const btnSkeleton = document.getElementById("btnSkeleton");
const btnHud = document.getElementById("btnHud");

// State
let handLandmarker, faceLandmarker;
let currentStream = null;
let currentFacingMode = "user";
let isMirrored = true;
let showSkeleton = true;
let showHud = true;
let soundEnabled = true;
let phoneModeEnabled = true;
let isRunning = false;

let lastVideoTime = -1;
let currentGesture = "default";
let candidateGesture = "default";
let candidateStreak = 0;
let lastNonDefaultAt = performance.now();

let lastFace = null;
let lastFaceSeenThisFrame = false;
let lastYawDebug = 0;
let lastPitchDebug = 0;
let lastJawOpenDebug = 0;
let lastBrowDownDebug = 0;

let prevFrameData = null;
let motionScoreBuffer = [];
let lastSpinMotionDebug = 0;

let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function playMeowSound() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    const now = audioCtx.currentTime;

    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.22);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
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
// 4. ROBUST GEOMETRY & LANDMARK MATH
// =========================================================================
function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));
}

function angleDeg(a, b, c) {
  const v1 = { x: a.x - b.x, y: a.y - b.y, z: (a.z || 0) - (b.z || 0) };
  const v2 = { x: c.x - b.x, y: c.y - b.y, z: (c.z || 0) - (c.z || 0) };
  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const m1 = Math.hypot(v1.x, v1.y, v1.z);
  const m2 = Math.hypot(v2.x, v2.y, v2.z);
  if (m1 < 1e-7 || m2 < 1e-7) return 180;
  return (Math.acos(Math.min(1, Math.max(-1, dot / (m1 * m2)))) * 180) / Math.PI;
}

function classifyFinger(lm, mcpIdx, pipIdx, dipIdx, tipIdx) {
  const wrist = lm[0];
  const mcp = lm[mcpIdx];
  const pip = lm[pipIdx];
  const dip = lm[dipIdx];
  const tip = lm[tipIdx];

  const dWristTip = dist(wrist, tip);
  const dWristPip = dist(wrist, pip);
  const dWristDip = dist(wrist, dip);

  const anglePip = angleDeg(mcp, pip, tip);

  const isExtended = dWristTip > dWristPip * 1.10 && dWristTip > dWristDip * 0.95 && anglePip > 125;
  const isCurled = dWristTip < dWristPip * 1.10 || anglePip < 120;

  return { isExtended, isCurled };
}

function classifyHand(lm) {
  const wrist = lm[0];
  const handScale = dist(wrist, lm[9]) || 1e-6;

  const idxState = classifyFinger(lm, 5, 6, 7, 8);
  const midState = classifyFinger(lm, 9, 10, 11, 12);
  const ringState = classifyFinger(lm, 13, 14, 15, 16);
  const pkyState = classifyFinger(lm, 17, 18, 19, 20);

  const indexUp = idxState.isExtended;
  const middleUp = midState.isExtended;
  const ringUp = ringState.isExtended;
  const pinkyUp = pkyState.isExtended;

  const indexCurled = idxState.isCurled;
  const middleCurled = midState.isCurled;
  const ringCurled = ringState.isCurled;
  const pinkyCurled = pkyState.isCurled;

  const thumbTip = lm[4];
  const indexMcp = lm[5];
  const pinkyMcp = lm[17];
  const thumbSpread = dist(thumbTip, pinkyMcp) / handScale;
  const thumbOut = thumbSpread > 0.90 && dist(thumbTip, indexMcp) / handScale > 0.50;

  const extendedCount = [indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length;
  const curledCount = [indexCurled, middleCurled, ringCurled, pinkyCurled].filter(Boolean).length;

  const isBottomGrip = wrist.y > 0.72 || lm[9].y > 0.74;

  return {
    indexUp,
    middleUp,
    ringUp,
    pinkyUp,
    indexCurled,
    middleCurled,
    ringCurled,
    pinkyCurled,
    thumbOut,
    extendedCount,
    curledCount,
    handScale,
    indexTip: lm[8],
    wrist: lm[0],
    palmCenter: lm[9],
    isBottomGrip,
  };
}

function parseBlendshapes(faceResult) {
  const scores = {};
  if (faceResult.faceBlendshapes && faceResult.faceBlendshapes.length > 0) {
    for (const b of faceResult.faceBlendshapes[0].categories) {
      scores[b.categoryName] = b.score;
    }
  }
  return scores;
}

function extractHeadPose(faceResult, lm) {
  let yaw = 0;
  let pitch = 0;

  if (
    faceResult.facialTransformationMatrixes &&
    faceResult.facialTransformationMatrixes.length > 0
  ) {
    const m = faceResult.facialTransformationMatrixes[0].data;
    const r00 = m[0], r10 = m[4], r20 = m[8];
    const r21 = m[9], r22 = m[10];
    const sy = Math.hypot(r00, r10);
    if (sy >= 1e-6) {
      yaw = (Math.atan2(-r20, sy) * 180) / Math.PI;
      pitch = (Math.atan2(r21, r22) * 180) / Math.PI;
    }
  }

  if (lm) {
    const nose = lm[1];
    const rightCheek = lm[234];
    const leftCheek = lm[454];
    const chin = lm[152];
    const forehead = lm[10];

    if (rightCheek && leftCheek && nose) {
      const faceSpan = leftCheek.x - rightCheek.x;
      if (Math.abs(faceSpan) > 1e-4) {
        const ratio = (nose.x - rightCheek.x) / faceSpan;
        const approxYaw = (ratio - 0.5) * 85;
        if (Math.abs(approxYaw) > Math.abs(yaw)) {
          yaw = approxYaw;
        }
      }
    }

    if (forehead && chin && nose) {
      const faceHeight = chin.y - forehead.y;
      if (faceHeight > 1e-4) {
        const noseRel = (nose.y - forehead.y) / faceHeight;
        const approxPitch = (noseRel - 0.55) * 75;
        if (Math.abs(approxPitch) > Math.abs(pitch)) {
          pitch = approxPitch;
        }
      }
    }
  }

  return { yaw, pitch };
}

function updateFace(faceResult) {
  const now = performance.now();
  const sawFace = !!(faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0);

  if (sawFace) {
    const f = faceResult.faceLandmarks[0];
    const upperLip = f[13];
    const lowerLip = f[14];
    const rightCheek = f[234];
    const leftCheek = f[454];

    const mouthCenter = {
      x: (upperLip.x + lowerLip.x) / 2,
      y: (upperLip.y + lowerLip.y) / 2,
      z: ((upperLip.z || 0) + (lowerLip.z || 0)) / 2,
    };
    const faceWidth = dist(rightCheek, leftCheek) || 0.1;

    const blendshapes = parseBlendshapes(faceResult);
    const { yaw, pitch } = extractHeadPose(faceResult, f);

    const jawOpen = blendshapes["jawOpen"] || dist(upperLip, lowerLip) / faceWidth;
    
    // Eyebrow furrow detection (Nhíu lông mày)
    const browDownLeft = blendshapes["browDownLeft"] || 0;
    const browDownRight = blendshapes["browDownRight"] || 0;
    const browDownBlend = Math.max((browDownLeft + browDownRight) / 2, browDownLeft, browDownRight);

    let browDownGeom = 0;
    if (f[107] && f[336] && f[159] && f[386]) {
      const browEyeDist = (dist(f[107], f[159]) + dist(f[336], f[386])) / 2;
      const browEyeRatio = browEyeDist / faceWidth;
      if (browEyeRatio < 0.13) {
        browDownGeom = (0.13 - browEyeRatio) / 0.04;
      }
    }
    const browDown = Math.max(browDownBlend, browDownGeom);

    lastFace = {
      mouthCenter,
      faceWidth,
      jawOpen,
      yaw,
      pitch,
      browDown,
      t: now,
    };

    lastYawDebug = yaw;
    lastPitchDebug = pitch;
    lastJawOpenDebug = jawOpen;
    lastBrowDownDebug = browDown;
  }
  lastFaceSeenThisFrame = sawFace;
}

function measureFrameMotion() {
  if (!video || video.videoWidth === 0) return 0;
  const sw = 64, sh = 48;
  if (!window._scratchCanvas) {
    window._scratchCanvas = document.createElement("canvas");
    window._scratchCanvas.width = sw;
    window._scratchCanvas.height = sh;
    window._scratchCtx = window._scratchCanvas.getContext("2d", { willReadFrequently: true });
  }

  const sctx = window._scratchCtx;
  sctx.drawImage(video, 0, 0, sw, sh);
  const imgData = sctx.getImageData(0, 0, sw, sh).data;

  if (!prevFrameData) {
    prevFrameData = imgData;
    return 0;
  }

  let totalDiff = 0;
  for (let i = 0; i < imgData.length; i += 4) {
    totalDiff +=
      Math.abs(imgData[i] - prevFrameData[i]) +
      Math.abs(imgData[i + 1] - prevFrameData[i + 1]) +
      Math.abs(imgData[i + 2] - prevFrameData[i + 2]);
  }
  prevFrameData = imgData;
  return totalDiff / (sw * sh * 3);
}

function checkSpinMotion() {
  const motion = measureFrameMotion();
  lastSpinMotionDebug = motion;

  motionScoreBuffer.push({ t: performance.now(), score: motion });
  const cutoff = performance.now() - 1500;
  motionScoreBuffer = motionScoreBuffer.filter((m) => m.t > cutoff);

  if (motionScoreBuffer.length > 10) {
    const highMotionFrames = motionScoreBuffer.filter((m) => m.score > 28).length;
    return highMotionFrames / motionScoreBuffer.length > 0.65;
  }
  return false;
}

// =========================================================================
// 5. SMART SINGLE HAND GESTURE EVALUATION (ALL 1-HAND GESTURES)
// =========================================================================
function getSingleHandGesture(h, faceInfo) {
  const { faceIsFresh, lastFace, lastFaceSeenThisFrame } = faceInfo;

  // 1. Shhh (Index finger touching mouth) -> Highest priority
  const isOnlyIndex = h.indexUp && !h.middleUp && !h.ringUp;
  if (isOnlyIndex) {
    if (faceIsFresh && lastFace) {
      const dMouth = dist(h.indexTip, lastFace.mouthCenter) / lastFace.faceWidth;
      if (dMouth < 0.62) {
        return { gesture: "shhh", priority: 10 };
      }
    }
    // One finger up: pointing up away from mouth
    return { gesture: "oneFingerUp", priority: 8 };
  }

  // 2. Rockstar / Shaka / Rock Horns (🤘 / 🤙)
  // Supports BOTH:
  // a) Rock horns (🤘): Index + Pinky up, Middle + Ring curled
  // b) Shaka (🤙): Thumb + Pinky out, Index + Middle + Ring curled
  const isRockHorns = h.indexUp && h.pinkyUp && !h.middleUp && !h.ringUp;
  const isShaka = h.thumbOut && h.pinkyUp && !h.indexUp && !h.middleUp && !h.ringUp;
  if (isRockHorns || isShaka) {
    return { gesture: "rockstar", priority: 9 };
  }

  // 3. Hand Covering Face (Palm over mouth/face, NOT holding phone)
  if (faceIsFresh && lastFace) {
    const dFace = dist(h.palmCenter, lastFace.mouthCenter) / lastFace.faceWidth;
    const threshold = lastFaceSeenThisFrame ? 0.72 : 1.25;
    if (dFace < threshold && !h.isBottomGrip) {
      return { gesture: "handCoverFace", priority: 7 };
    }
  }

  // 4. Open Palm / Stretched Out (🫴)
  if (h.extendedCount >= 3 && !h.isBottomGrip) {
    if (!faceIsFresh || dist(h.palmCenter, lastFace.mouthCenter) / lastFace.faceWidth > 0.8) {
      return { gesture: "handStretchedOut", priority: 6 };
    }
  }

  // 5. Fist (👊 Punchcat)
  const isFist = !h.indexUp && !h.middleUp && !h.ringUp && !h.pinkyUp;
  if (isFist) {
    if (phoneModeEnabled && h.isBottomGrip) {
      return { gesture: "none", priority: 0 };
    }
    return { gesture: "fist", priority: 5 };
  }

  return { gesture: "none", priority: 0 };
}

// =========================================================================
// 6. MAIN DECISION TREE
// =========================================================================
function decideGesture(handResult) {
  const now = performance.now();
  const faceIsFresh = !!lastFace && now - lastFace.t < FACE_STALE_MS;
  const faceInfo = { faceIsFresh, lastFace, lastFaceSeenThisFrame };

  // 1. Spin Motion Check
  if (checkSpinMotion()) {
    return "spinCat";
  }

  const numHands = (handResult.landmarks && handResult.landmarks.length) || 0;

  // NO HANDS IN FRAME: Facial expressions / Head pose
  if (numHands === 0) {
    if (faceIsFresh) {
      if (lastJawOpenDebug > HUH_JAW_THRESHOLD) {
        return "huhCat";
      }
      if (lastFace.browDown > BROW_DOWN_THRESHOLD) {
        return "sideEyeDownCat";
      }
      if (Math.abs(lastFace.yaw) > SIDE_EYE_YAW_DEG) {
        return "sideEyeCat";
      }
    }
    return "default";
  }

  const hands = handResult.landmarks.map(classifyHand);

  // 2. Laugh & Point: Mouth wide open WITH an active hand in frame
  if (faceIsFresh && lastJawOpenDebug > MOUTH_OPEN_JAW_THRESHOLD) {
    const hasActiveHand = hands.some((h) => !phoneModeEnabled || !h.isBottomGrip);
    if (hasActiveHand) {
      return "mouthOpenCat";
    }
  }

  // -----------------------------------------------------------------------
  // TWO OR MORE HANDS DETECTED
  // -----------------------------------------------------------------------
  if (hands.length >= 2) {
    const [h1, h2] = hands;

    // A. Two Fingers Together (👉👈 Muehehe): Both index fingers pointing, tips touching
    const h1Pointing = h1.indexUp && !h1.middleUp && !h1.ringUp;
    const h2Pointing = h2.indexUp && !h2.middleUp && !h2.ringUp;
    if (h1Pointing && h2Pointing) {
      const avgScale = (h1.handScale + h2.handScale) / 2;
      const tipGap = dist(h1.indexTip, h2.indexTip) / avgScale;
      if (tipGap < 1.7) {
        return "twoFingersTogether";
      }
    }

    // B. Two Hands on Head (🤯) vs Crash Out Cat (😱)
    if (faceIsFresh && lastFace) {
      const { mouthCenter, faceWidth } = lastFace;
      const h1Dist = dist(h1.palmCenter, mouthCenter) / faceWidth;
      const h2Dist = dist(h2.palmCenter, mouthCenter) / faceWidth;

      // Both hands held up high on or above head
      const headTopY = mouthCenter.y - faceWidth * 0.6;
      const bothOnHead = (h1.palmCenter.y < headTopY && h2.palmCenter.y < headTopY) ||
                         (h1.palmCenter.y < 0.42 && h2.palmCenter.y < 0.42);
      if (bothOnHead && !h1.isBottomGrip && !h2.isBottomGrip) {
        return "twoHandsOnHead";
      }

      // Crash Out Cat: 2 hands beside cheeks/temples
      if (h1Dist < 2.5 && h2Dist < 2.5 && !h1.isBottomGrip && !h2.isBottomGrip) {
        return "crashOutCat";
      }
    }

    // C. Dance Cat (💃) & Shrug Cat (🤷)
    const bothOpen = h1.extendedCount >= 2 && h2.extendedCount >= 2 && !h1.isBottomGrip && !h2.isBottomGrip;
    if (bothOpen) {
      const ys = [h1.palmCenter.y, h2.palmCenter.y].sort((a, b) => a - b);
      if (ys[0] < 0.45 && ys[1] > 0.55) {
        return "danceCat";
      }

      const xs = [h1.palmCenter.x, h2.palmCenter.x].sort((a, b) => a - b);
      if (Math.abs(xs[1] - xs[0]) > 0.35) {
        return "shrugCat";
      }
    }

    // D. No 2-hand gesture matched -> Evaluate each hand independently!
    const res1 = getSingleHandGesture(h1, faceInfo);
    const res2 = getSingleHandGesture(h2, faceInfo);

    if (res1.priority > res2.priority && res1.gesture !== "none") {
      return res1.gesture;
    } else if (res2.priority > res1.priority && res2.gesture !== "none") {
      return res2.gesture;
    } else if (res1.gesture !== "none") {
      return res1.gesture;
    } else if (res2.gesture !== "none") {
      return res2.gesture;
    }
  } else if (hands.length === 1) {
    const res = getSingleHandGesture(hands[0], faceInfo);
    if (res.gesture !== "none") {
      return res.gesture;
    }
  }

  // Fallback: Head pose & Facial expressions
  if (faceIsFresh) {
    if (lastFace.browDown > BROW_DOWN_THRESHOLD) {
      return "sideEyeDownCat";
    }
    if (Math.abs(lastFace.yaw) > SIDE_EYE_YAW_DEG) {
      return "sideEyeCat";
    }
  }

  return "default";
}

// =========================================================================
// 7. MEME MEDIA SWITCHER & SFX
// =========================================================================
function pickImage(files) {
  return files[Math.floor(Math.random() * files.length)];
}

function applyGesture(gesture) {
  if (gesture === currentGesture) return;
  currentGesture = gesture;

  const item = GESTURE_MEMES[gesture] || GESTURE_MEMES.default;
  badgeText.textContent = item.label;

  playMeowSound();

  if (item.isVideo) {
    memeImg.style.display = "none";
    memeVideo.style.display = "block";
    memeVideo.src = item.files[0];
    memeVideo.play().catch(() => {});
  } else {
    memeVideo.style.display = "none";
    memeVideo.pause();
    memeImg.style.display = "block";
    memeImg.src = pickImage(item.files);
  }
}

// =========================================================================
// 8. CANVAS OVERLAY (HANDS ONLY)
// =========================================================================
function drawOverlays(handResult) {
  if (!ctx || !canvas) return;

  if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!showSkeleton) return;

  const w = canvas.width;
  const h = canvas.height;

  if (handResult.landmarks) {
    for (const lm of handResult.landmarks) {
      const isBottom = lm[0].y > 0.72;
      const alpha = phoneModeEnabled && isBottom ? 0.4 : 0.85;

      ctx.lineWidth = 3;
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = isBottom ? 0 : 6;

      for (const [start, end] of HAND_CONNECTIONS) {
        ctx.beginPath();
        ctx.moveTo(lm[start].x * w, lm[start].y * h);
        ctx.lineTo(lm[end].x * w, lm[end].y * h);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      for (let i = 0; i < lm.length; i++) {
        const isTip = [4, 8, 12, 16, 20].includes(i);
        ctx.beginPath();
        ctx.arc(lm[i].x * w, lm[i].y * h, isTip ? 6 : 4, 0, 2 * Math.PI);
        ctx.fillStyle = isTip ? `rgba(251, 113, 133, ${alpha})` : `rgba(52, 211, 153, ${alpha})`;
        ctx.fill();
      }
    }
  }
}

function updateDebugHud() {
  if (!debugHud || !showHud) return;
  const item = GESTURE_MEMES[currentGesture] || GESTURE_MEMES.default;
  debugHud.textContent =
    `Gesture: ${item.label}\n` +
    `PhoneFilter: ${phoneModeEnabled ? "ON 📱" : "OFF"}\n` +
    `BrowDown: ${lastBrowDownDebug.toFixed(2)} (Nhíu mày > ${BROW_DOWN_THRESHOLD})\n` +
    `Yaw: ${lastYawDebug >= 0 ? "+" : ""}${lastYawDebug.toFixed(1)}°\n` +
    `JawOpen: ${lastJawOpenDebug.toFixed(2)}`;
}

// =========================================================================
// 9. SNAPSHOT PHOTO CREATOR (📸)
// =========================================================================
async function takeSnapshot() {
  playShutterSound();

  flashOverlay.classList.add("flashing");
  setTimeout(() => flashOverlay.classList.remove("flashing"), 120);

  const offCanvas = document.createElement("canvas");
  const offCtx = offCanvas.getContext("2d");

  offCanvas.width = 1280;
  offCanvas.height = 640;

  offCtx.fillStyle = "#090a0f";
  offCtx.fillRect(0, 0, 1280, 640);

  offCtx.save();
  if (isMirrored) {
    offCtx.translate(640, 0);
    offCtx.scale(-1, 1);
    offCtx.drawImage(video, 0, 0, 640, 640);
  } else {
    offCtx.drawImage(video, 0, 0, 640, 640);
  }
  offCtx.restore();

  if (showSkeleton && canvas) {
    offCtx.save();
    if (isMirrored) {
      offCtx.translate(640, 0);
      offCtx.scale(-1, 1);
    }
    offCtx.drawImage(canvas, 0, 0, 640, 640);
    offCtx.restore();
  }

  try {
    const item = GESTURE_MEMES[currentGesture] || GESTURE_MEMES.default;
    const memeSource = item.isVideo ? memeVideo : memeImg;
    offCtx.drawImage(memeSource, 640, 0, 640, 640);
  } catch (e) {}

  offCtx.fillStyle = "rgba(15, 23, 42, 0.85)";
  offCtx.roundRect ? offCtx.roundRect(20, 20, 360, 48, 24) : offCtx.fillRect(20, 20, 360, 48);
  offCtx.fill();

  offCtx.fillStyle = "#93c5fd";
  offCtx.font = "bold 20px -apple-system, sans-serif";
  const item = GESTURE_MEMES[currentGesture] || GESTURE_MEMES.default;
  offCtx.fillText(item.label, 40, 52);

  const dataUrl = offCanvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `catcam_${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToast("📸 Đã lưu ảnh kỷ niệm!");
}

// =========================================================================
// 10. GESTURE CATALOG DRAWER POPULATION
// =========================================================================
function buildGestureDrawer() {
  if (!gestureGrid) return;
  gestureGrid.innerHTML = "";

  for (const [key, item] of Object.entries(GESTURE_MEMES)) {
    const card = document.createElement("div");
    card.className = "gesture-card";

    const imgSrc = item.files[0].endsWith(".mov") ? "memes/pokercat.jpg" : item.files[0];

    card.innerHTML = `
      <img src="${imgSrc}" class="gesture-card-img" alt="${item.label}" />
      <div class="gesture-card-body">
        <div class="gesture-card-title">${item.label}</div>
        <div class="gesture-card-desc">${item.desc}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      applyGesture(key);
      gestureDrawer.classList.add("hidden");
      showToast(`Kích hoạt: ${item.label}`);
    });

    gestureGrid.appendChild(card);
  }
}

// =========================================================================
// 11. MAIN LOOP
// =========================================================================
function loop() {
  if (!isRunning) return;
  const now = performance.now();

  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    const ts = performance.now();

    const handResult = handLandmarker.detectForVideo(video, ts);
    const faceResult = faceLandmarker.detectForVideo(video, ts);
    updateFace(faceResult);

    const gesture = decideGesture(handResult);

    if (gesture === candidateGesture) {
      candidateStreak++;
    } else {
      candidateGesture = gesture;
      candidateStreak = 1;
    }

    if (candidateStreak >= STABLE_FRAMES_REQUIRED) {
      applyGesture(gesture);
    }

    if (gesture !== "default") lastNonDefaultAt = now;
    if (now - lastNonDefaultAt > DEFAULT_FALLBACK_MS && currentGesture !== "default") {
      applyGesture("default");
    }

    drawOverlays(handResult);
    updateDebugHud();
  }

  requestAnimationFrame(loop);
}

// =========================================================================
// 12. CAMERA MANAGEMENT
// =========================================================================
async function startCamera(facing = currentFacingMode) {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      "Trình duyệt không hỗ trợ Camera qua kết nối này.\nNếu bạn đang dùng iPad/iPhone, hãy chắc chắn bạn truy cập bằng giao thức HTTPS (ví dụ: https://192.168.4.191:8443) thay vì HTTP!"
    );
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
    if (canvas) canvas.classList.remove("unmirrored");
    btnMirror.classList.add("active");
  } else {
    video.classList.add("unmirrored");
    if (canvas) canvas.classList.add("unmirrored");
    btnMirror.classList.remove("active");
  }
}

// =========================================================================
// 13. FULLSCREEN TOGGLE HELPER
// =========================================================================
function toggleFullscreen() {
  const doc = document;
  const elem = doc.documentElement;
  const isFull = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);

  if (!isFull) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (video && video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
    if (btnFullscreen) btnFullscreen.classList.add("active");
    showToast("⛶ Đã mở toàn màn hình");
  } else {
    if (doc.exitFullscreen) {
      doc.exitFullscreen().catch(() => {});
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
    if (btnFullscreen) btnFullscreen.classList.remove("active");
    showToast("Thu nhỏ màn hình");
  }
}

// =========================================================================
// 14. INITIALIZATION & TOUCH INTERACTION LISTENERS
// =========================================================================
async function init() {
  buildGestureDrawer();

  try {
    overlayTitle.textContent = "Đang tải mô hình AI...";
    overlayDesc.textContent = "MediaPipe Vision Models đang được nạp...";

    const fileset = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );

    overlayDesc.textContent = "Đang khởi tạo Hand & Face Detector...";

    handLandmarker = await HandLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
    });

    faceLandmarker = await FaceLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
    });

    overlayTitle.textContent = "Đã sẵn sàng!";
    overlayDesc.textContent = "Nhấn nút bên dưới để cấp quyền và mở Camera.";
    spinner.style.display = "none";
    startBtn.style.display = "inline-block";

    startCamera("user")
      .then(() => {
        loadingOverlay.classList.add("hidden");
        isRunning = true;
        initAudio();
        requestAnimationFrame(loop);
      })
      .catch((err) => {
        console.warn("User click required for camera start:", err);
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
    requestAnimationFrame(loop);
  } catch (err) {
    console.error(err);
    errorBanner.style.display = "block";
    errorBanner.innerText = err.message || String(err);
  }
});

if (btnFullscreen) {
  btnFullscreen.addEventListener("click", toggleFullscreen);
}

if (btnPhoneMode) {
  btnPhoneMode.addEventListener("click", () => {
    phoneModeEnabled = !phoneModeEnabled;
    if (phoneModeEnabled) {
      btnPhoneMode.classList.add("active");
      showToast("📱 Đã BẬT lọc tay cầm điện thoại");
    } else {
      btnPhoneMode.classList.remove("active");
      showToast("📱 Đã TẮT lọc tay cầm điện thoại");
    }
  });
}

btnSwitchCam.addEventListener("click", async () => {
  const targetMode = currentFacingMode === "user" ? "environment" : "user";
  try {
    await startCamera(targetMode);
    showToast(targetMode === "user" ? "📷 Camera trước (Selfie)" : "📸 Camera sau");
  } catch (err) {
    alert("Không thể chuyển camera: " + err.message);
  }
});

btnLayout.addEventListener("click", () => {
  currentLayoutIndex = (currentLayoutIndex + 1) % LAYOUT_MODES.length;
  const layout = LAYOUT_MODES[currentLayoutIndex];
  appContainer.className = `app-container ${layout.id}`;
  showToast(`Bố cục: ${layout.name}`);
});

btnSnapshot.addEventListener("click", () => {
  takeSnapshot();
});

btnGuide.addEventListener("click", () => {
  gestureDrawer.classList.remove("hidden");
});
btnCloseDrawer.addEventListener("click", () => {
  gestureDrawer.classList.add("hidden");
});
gestureDrawer.addEventListener("click", (e) => {
  if (e.target === gestureDrawer) {
    gestureDrawer.classList.add("hidden");
  }
});

gestureBadge.addEventListener("click", () => {
  gestureDrawer.classList.remove("hidden");
});

memePane.addEventListener("click", () => {
  memeImg.classList.remove("meme-bounce");
  memeVideo.classList.remove("meme-bounce");
  void memeImg.offsetWidth;
  memeImg.classList.add("meme-bounce");
  memeVideo.classList.add("meme-bounce");
  playMeowSound();
});

let lastCameraTapTime = 0;
cameraPane.addEventListener("click", async () => {
  const now = Date.now();
  if (now - lastCameraTapTime < 350) {
    const targetMode = currentFacingMode === "user" ? "environment" : "user";
    try {
      await startCamera(targetMode);
      showToast(targetMode === "user" ? "📷 Camera trước" : "📸 Camera sau");
    } catch (err) {}
  } else {
    tapHint.style.opacity = "1";
    setTimeout(() => (tapHint.style.opacity = "0"), 800);
  }
  lastCameraTapTime = now;
});

btnSound.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    btnSound.classList.add("active");
    btnSound.textContent = "🔊 Tiếng";
    playMeowSound();
    showToast("Đã bật âm thanh 🔊");
  } else {
    btnSound.classList.remove("active");
    btnSound.textContent = "🔇 Tắt tiếng";
    showToast("Đã tắt âm thanh 🔇");
  }
});

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
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

btnHud.addEventListener("click", () => {
  showHud = !showHud;
  if (showHud) {
    debugHud.classList.remove("hidden");
    btnHud.classList.add("active");
  } else {
    debugHud.classList.add("hidden");
    btnHud.classList.remove("active");
  }
});

init();
