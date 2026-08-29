# AI Gesture Studio

A real-time computer vision gesture recognition interactive studio built with **MediaPipe Tasks Vision** and procedural **Web Audio Synthesis**. This project includes two independent interactive experiences unified under a central Launch Hub:

---

## Key Features

### 1. Flora AR Studio (`/flower/`)

- **Dual-Hand Botanical Gestures**:
  - **Left Hand (Thumb-Index Pinch Spread)**: Adjusts dynamic stem height and growth upward from the ground.
  - **Right Hand (Thumb-Index Pinch Spread)**: Controls organic petal blooming progression from tight bud to full bloom across multiple anatomical layers.
- **Seven Procedural Botanical Species**:
  - **Royal Pink Lily**: Oriental pink lily with crimson papillae, delicate filaments, and golden anthers.
  - **Velvet Red Rose**: Deep velvet red multi-layer swirling rose petals.
  - **Japanese Sakura**: Cherry blossom with heart-notched silk petals.
  - **Golden Sunflower**: Radiant golden florets with detailed seed disc receptacle.
  - **Sacred Lotus**: Floating pink water lotus with golden central core.
  - **Cosmic Night Orchid**: Bioluminescent galaxy orchid with stardust ambient glow.
  - **Dutch Royal Tulip**: Elegant cup-shaped Dutch crimson tulip.
- **Multi-Flower Selection and Synchronized Blooming**:
  - Select individual flowers from the top ribbon or tap "Select All" to grow and bloom multiple flowers simultaneously in unison.
- **Double-Tap Quick Gesture Activation**:
  - Double-tap anywhere on the viewport to instantly toggle AI gesture recognition on or off.
- **Multi-Touch Pinch-to-Zoom**:
  - Use two-finger pinch gestures or mouse wheel to adjust flower scale smoothly between 30% and 280%.
- **Zero-Slip Viewport Dragging**:
  - Freely drag individual flowers anywhere across the scene without triggering background scrolling.
- **Draggable HUD Control Panels**:
  - Move the Left (Grow) and Right (Bloom) gauge cards to any position on screen.
- **Bilingual Interface**:
  - Instant language toggling between English (EN) and Vietnamese (VI).
- **High-Resolution AR Snapshot Capture**:
  - Capture composite video and canvas frames directly to device gallery.

### 2. Meow Meow Cat Cam (`/cat/`)

- **8+ Gesture-Driven Meme Responses**:
  - Real-time hand landmark and facial expression tracking mapped to corresponding meme cat animations with responsive sound effects.
- **Phone-Holding Rejection Filter**:
  - Automatically identifies and suppresses the hand gripping the camera device during video recording to prevent accidental trigger activations.
- **Meme Snapshot Generator**:
  - Capture and export photos with active meme overlays.

---

## Project Structure

```text
AR-gesture/
├── index.html                    # Central Launch Hub Portal
│
├── flower/                       # Flora AR Studio Module
│   ├── index.html                # Main entry for Flora AR Studio
│   ├── lily.html                 # Flora AR Studio (Unified AR Viewport)
│   ├── lily.js                   # MediaPipe vision & procedural rendering engine
│   ├── flower.html               # Split-screen simulation interface
│   └── flower.js                 # Split-screen engine
│
├── cat/                          # Meow Meow Cat Cam Module
│   ├── index.html                # Cat Cam web interface
│   ├── app.js                    # Gesture recognition & meme engine
│   ├── gesture_meme.py           # Desktop Python OpenCV implementation
│   ├── memes/                    # Cat meme image and audio assets
│   └── models/                   # MediaPipe AI vision model binaries
│
├── cert.pem / key.pem            # Local SSL certificates for HTTPS
└── server.py                     # Multi-threaded local HTTPS server
```

---

## Getting Started

### 1. Running on Mobile / iPad (Safari HTTPS)

1. Start the local HTTPS server:
   ```bash
   python server.py 8443
   ```
2. Open **Safari** on your iPad or mobile device connected to the same local network:
   ```text
   https://<YOUR_LOCAL_IP>:8443/
   ```
3. When prompted:
   - Tap **"Show Details"** -> Tap **"Visit this website"** to accept the local self-signed certificate.
   - Allow camera access permissions.

### 2. Running on Desktop (Python OpenCV)

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the desktop application:
   ```bash
   python cat/gesture_meme.py
   ```
3. Press `q` or `Esc` to exit.

---

## Author & Credits

- **Developer**: [Khanh Tran (Vcab3011)](https://github.com/Vcab3011)
- **GitHub**: [https://github.com/Vcab3011](https://github.com/Vcab3011)
- **Repository**: [https://github.com/Vcab3011/AR-Gesture-Studio](https://github.com/Vcab3011/AR-Gesture-Studio)
