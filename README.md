# 🤖 Portable Web & Android 2D Game Skill

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Web | Android | iOS](https://img.shields.io/badge/Platform-Web%20%7C%20Android%20%7C%20iOS-blue.svg)](#)
[![Stack: React + Vite + TypeScript](https://img.shields.io/badge/Stack-React%20%2B%20Vite%20%2B%20TypeScript-orange.svg)](#)

A professional, high-performance, cross-platform 2D game scaffolding skill and boilerplate template. Seamlessly deploy web-based 2D games to **Android APKs (without installing Android Studio)**, **iOS (via Capacitor)**, and **Itch.io (with CORS sandbox support)** from a single, unified codebase.

This repository is built as an **Agentic Skill & Prompt Plugin** for AI coding assistants (like Gemini, Claude, Cursor, and custom developer agents). It equips AI coders with the exact architectural rules, templates, and build automation required to scaffold an production-ready 2D game in a single turn.

---

## 🌟 Key Features & Architecture

### 1. Zero-Dependency Portable Android Builds
* **Local SDK/JDK Sandboxing**: Contains pre-configured PowerShell scripts (`setup-mobile-env.ps1` and `build-apk.ps1`) that bootstrap a localized Adoptium OpenJDK 21 and the Android Command Line Tools under `/.local-env/`.
* **No Heavy IDE Requirements**: Compile fully-signed native debug Android APKs directly from your command-line interface without installing Android Studio, Gradle, or setting global environment variables.

### 2. Aspect-Ratio Bounding Box Scaling (Web vs. Native)
* **Web & Itch.io Embeds**: Renders the game inside an aspect-ratio-locked virtual viewport that matches simulated phone or desktop screens without using blind CSS translation hacks.
* **Capacitor Mobile Shell**: Automatically detects when running inside native WebViews, unlocking 100% fluid, edge-to-edge rendering that scales dynamically around camera notches, rounded device corners, and system navigation bars using safe-area variables (`env(safe-area-inset-*)`).

### 3. Native Sandboxed Embed Support (Itch.io Fix)
* **CORS Sandbox Bypass**: Integrates a custom Vite build plugin (`vite-plugin-crossorigin.ts`) that automatically strips `crossorigin` attributes from compiled HTML `<script>` and `<link>` tags.
* **No More "Gray Screens"**: Neutralizes origin-restricted sandbox blocks that standard WebGL/React engines suffer from when hosted inside Itch.io frames.

### 4. Professional Game Loops & Inputs
* **High-Performance Loop Hook**: Features a robust `requestAnimationFrame`-based game loop (`useGameLoop.ts`) designed to handle render ticks efficiently using React mutable references.
* **No Physics Explosions**: Clamps game loop update cycles during browser stuttering or lag spikes to keep game physics stable.
* **Interference Neutralization**: Disables system default behaviors (iOS touch menus, pull-to-refresh reload actions, and drag-selection) to ensure high-grade, uninterrupted mobile gameplay.

---

## 📂 Repository Contents

This skill is structured to be instantly parsed by AI systems and developers alike:

```text
portable-web-android-game-skill/
├── SKILL.md                 # Core AI System Prompt Instructions & Guidelines
└── assets/                  # Scaffolding templates injected by the AI agent
    ├── BoundingBox.tsx      # Dual-mode mobile WebView & aspect-ratio scaling component
    ├── global.css           # Touch preventing, scrollbar neutralizing, safe area styles
    ├── useGameLoop.ts       # requestAnimationFrame based high-performance game loop hook
    ├── vite-plugin-crossorigin.ts # Itch.io CORS/sandbox script attribute stripper plugin
    ├── setup-mobile-env.ps1 # Local portable JDK 21 and Android SDK bootstrapper script
    └── build-apk.ps1        # Local portable assembly compile & packaging script
```

---

## 🚀 How to Load This Skill in Your AI Assistant

Priming your AI coding assistant with this scaffold allows it to build the game environment for you in seconds.

### Option A: Local Skill Directory Reference (Gemini / Antigravity)
If you are running an agent platform that supports local plugin overrides:
1. Clone this repository into your local configurations directory:
   ```bash
   git clone https://github.com/ishanmanjrekar/portable-web-android-game-skill.git ~/.gemini/config/skills/portable-web-android-game-skill
   ```
2. The AI assistant will automatically discover the `/portable-web-android-game-skill` command, read the system guidelines in `SKILL.md`, and copy files from the `assets/` subdirectory when requested to build a new game!

### Option B: System Prompt Context Feeding (Generic AI Models)
If you are using a standard AI chat interface (like ChatGPT or Claude.ai) to scaffold a game:
1. Copy the entire contents of [SKILL.md](./SKILL.md).
2. Paste it as a system instruction or context header, saying:
   > *"Act as an expert Game Architect. Follow the instructions and template structures in the text below to scaffold a new cross-platform React 2D game project for me."*

---

## 📄 License
This repository is licensed under the MIT License - feel free to share, modify, and build custom AI-gamedev skill libraries!

