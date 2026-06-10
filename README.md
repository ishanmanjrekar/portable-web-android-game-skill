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

## 🚀 How to Use This Skill in Any AI Tool

Whether you are using a terminal-based agent, an editor like Cursor, or just standard web chat interfaces, you can easily load this skill to scaffold a fully functional, cross-platform 2D game in seconds.

### 👶 Noob-Friendly: The "Just Tell the AI" Method (Easiest)
If you don't want to deal with command lines or cloning repositories, you can simply feed this repository URL directly to your AI!

1. Open your AI coding assistant or chat interface (e.g., ChatGPT, Claude.ai, Cursor Chat, Copilot, etc.).
2. Copy this URL: `https://github.com/ishanmanjrekar/portable-web-android-game-skill`
3. Paste the URL and send this prompt to your AI:
   > *"Please read the instructions and templates at this link: https://github.com/ishanmanjrekar/portable-web-android-game-skill. Once you understand them, use them to scaffold a new portable 2D web and Android game for me in my current directory!"*
4. Sit back and watch the AI do the work!

---

### 🛠️ Tool-Specific Setup Instructions

If you want a more integrated experience, choose your preferred AI assistant below:

#### 1. Cursor & Windsurf (Editor-based AI)
To use this skill inside Cursor or Windsurf:
* **Option A (URL Reference)**: Start a Composer or Chat session, type `@` followed by the URL:
  `@https://github.com/ishanmanjrekar/portable-web-android-game-skill`
  Then ask: *"Use this skill to set up a new React 2D game project."*
* **Option B (Local Context)**: Clone this repository into an empty folder or download the files. Put `SKILL.md` and the `assets` folder in your project's root. In Cursor, refer to the local file:
  `@SKILL.md Please scaffold the game using these instructions and the assets directory.`

#### 2. Claude Code (Terminal-based AI)
Claude Code has full access to command execution and local file reads:
1. Initialize your project folder and clone this repository inside:
   ```bash
   git clone https://github.com/ishanmanjrekar/portable-web-android-game-skill.git
   ```
2. Start Claude by running:
   ```bash
   claude
   ```
3. Prompt Claude:
   > *"Read `portable-web-android-game-skill/SKILL.md` and use the templates in `portable-web-android-game-skill/assets` to scaffold a new game in my current directory."*

#### 3. Gemini / Antigravity (Local Plugin / Skill overrides)
If your AI agent supports local config-based skill folders (like Antigravity / Gemini Code Assist):
1. Clone this repository directly into your local AI configuration directory:
   ```bash
   git clone https://github.com/ishanmanjrekar/portable-web-android-game-skill.git ~/.gemini/config/skills/portable-web-android-game-skill
   ```
2. In your workspace, simply trigger the skill by asking the agent:
   > *"set up a new game"* or *"use portable-web-android-game-skill"*
   The agent will automatically locate `SKILL.md` and the assets, prompt you with an implementation plan, and scaffold the game upon approval.

#### 4. ChatGPT / Claude.ai (Web Interfaces)
If you're using a web browser interface:
1. Open the [SKILL.md](./SKILL.md) file in this repository.
2. Copy the entire contents of the file.
3. Paste it into your chat box and prepend it with:
   > *"I want you to act as an expert Game Architect. Follow the instructions and template structures in the text below to scaffold a new cross-platform React 2D game project for me:"*
   *(Paste contents of SKILL.md here)*

---

## 📄 License
This repository is licensed under the MIT License - feel free to share, modify, and build custom AI-gamedev skill libraries!

