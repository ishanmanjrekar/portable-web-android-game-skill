# 🎮 Portable Android Game Scaffold & Boilerplate

A high-performance, cross-platform 2D game boilerplate built with **React, Vite, TypeScript, Zustand, Framer Motion**, and **Capacitor**. 

Designed specifically for **game developers** who want to deploy a single codebase flawlessly to the **Web, Itch.io**, and **Android (native APK)**—featuring a **one-click portable build pipeline** that requires **no manual Android Studio installation** or global environment variables!

---

## ✨ Features

- **📦 100% Portable Local Android Build**: Comes with built-in PowerShell automation scripts that download a lightweight, isolated Adoptium JDK 21 and Android CLI toolset directly into a local `.local-env/` folder. Build native APKs locally with single commands!
- **📐 Advanced Bounding Box Pattern**:
  - **Web/Itch.io Mode**: Dynamically centers and scales game dimensions with aspect-ratio clamping to simulate standard device views.
  - **Native Android APK Mode**: Automatically detects Capacitor WebView wraps and goes **100% fluid full-screen borderless**, giving responsive layouts full screen utilization.
- **📱 Mobile & Touch Native Optimizations**:
  - Auto-binding of camera notches and device navigation swipe bars using safe area CSS parameters (`env(safe-area-inset-top)` etc.).
  - Hard blocks on web browser default long-press menus, callouts, and pull-to-refresh pull gestures.
- **⚡ Itch.io Sandbox Fixes**: Includes custom build pipelines configuring relative asset mapping (`base: './'`) and automatically stripping CORS `crossorigin` markers from output HTML injections, avoiding common "gray screen" sandboxing crashes on itch.io CDN embeds.
- **🎯 Premium Aesthetics**: Beautiful cosmic-dark design palette featuring floating micro-animations, neon stardust orbs, and GPU hardware acceleration.

---

## 🛠️ Core Tech Stack

- **UI Framework**: React 18 + Vite + TypeScript
- **State & Game Math**: Zustand (High-performance lightweight atomic state manager)
- **Fluid UI Animations**: Framer Motion (GPU hardware-accelerated loops)
- **Native Wrap**: Capacitor 6 (Cross-platform WebView native runtime)
- **Packager**: bestzip (Cross-platform POSIX zipping engine)

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install standard packages:
```bash
git clone https://github.com/ishanmanjrekar/portable-android-game-scaffold.git
cd portable-android-game-scaffold
npm install
```

### 2. Run Web Development Server
Launch the high-speed local Vite environment:
```bash
npm run dev
```

---

## 📱 Compiling Native Android APKs (Windows Portable Pipeline)

This project contains a fully self-contained build system. **You do not need to install Android Studio or configure global PATH parameters.**

### Step 1: Bootstrap the Portable SDK & JDK
Open PowerShell as an Administrator or inside a standard terminal and execute:
```powershell
./scripts/setup-mobile-env.ps1
```
*This downloads Adoptium JDK 21, Android Cmdline Tools, accepts licensing agreements, and prepares Android API 34 platforms locally under `/.local-env/`.*

### Step 2: Compile the Native APK
Compile the web assets and trigger the local Gradle assembly wrap:
```powershell
./scripts/build-apk.ps1
```
*Your finished, ready-to-install debug binary will be compiled and relocated to **`/dump/game-debug.apk`**!*

---

## 📦 Zipping for Itch.io Upload
To build a highly compliant web bundle and package it into a zip package for itch.io:
```bash
npm run build:itch
```
*Your optimized itch.io package will be saved under **`/dump/game-upload.zip`**.*

---

## 📂 Project Organization

```text
portable-android-game-scaffold/
├── .local-env/          # Local portable JDK and Android SDK (gitignored)
├── assets/              # Core Vite templates and plugins
├── dump/                # Final output builds (game-upload.zip, game-debug.apk) (gitignored)
├── scripts/
│   ├── setup-mobile-env.ps1  # Portable setup bootstrapper
│   └── build-apk.ps1         # Portable Gradle APK compiler
├── src/
│   ├── components/
│   │   └── BoundingBox.tsx   # Native notch & viewport aspect-ratio scaling
│   ├── store/
│   │   └── gameStore.ts      # Global clicker game state, powerups & stats
│   ├── App.tsx               # Primary game wrapper with elastic UI boundaries
│   ├── index.css             # Main styling rules, touch preventions & keyframes
│   └── main.tsx              # React mounting root
├── capacitor.config.ts  # Capacitor mobile build declarations
├── vite.config.ts       # Relative path asset bundles & cross-origin stripping
└── package.json         # Core script wrappers
```

---

## 📄 License
This project is licensed under the MIT License - feel free to customize and launch your own games!
