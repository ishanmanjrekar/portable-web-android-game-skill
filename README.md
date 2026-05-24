# 🤖 Agentic Web 2D Game Scaffold Skill

A reusable **Agentic Skill & Prompt Plugin** for AI coding assistants (like Gemini, Claude, Cursor, or custom developer agents). 

This repository equips AI coding tools with the architectural knowledge, guidelines, and template assets required to scaffold a professional, high-performance, cross-platform 2D game project from scratch in a single turn.

---

## 🌟 What This Skill Does

When an AI coding assistant imports or reads this skill, it gains the immediate capability to setup a React 2D game environment that:
1. **Compiles Native Android APKs Locally**: Bundles a fully portable Windows automation system (`scripts/setup-mobile-env.ps1` and `scripts/build-apk.ps1`) that downloads a localized JDK 21 and Android CLI toolset in `/.local-env/` to assemble debug binaries **without** requiring developers to install Android Studio or heavy system SDK variables.
2. **Adapts Fluid Viewports (Bounding Box Pattern)**:
   - **Web/Itch.io Mode**: Renders games within an aspect-ratio scale container mimicking virtual phone boundaries.
   - **Native Capacitor APK Mode**: Detects WebView wraps and goes **100% full-screen borderless**, scaling dynamically around speaker notches, camera holes, and native Android swipe navigation lines.
3. **Runs Flawlessly on Itch.io Sandbox embeds**: Configures relative paths and custom plugins to automatically strip CORS/sandbox script constraints (`crossorigin` attributes), bypassing the classic "gray screen freeze" bug common on itch.io CDNs.
4. **Enforces Responsive UI/Grid standards**: Implements bolt-edge panel flex layouts and native CSS Container Queries for tile grids, avoiding layout collapses on tall mobile aspect ratios (19.5:9) or foldable devices.
5. **Neutralizes Mobile Interference**: Hard blocks default context popup menus, pull-to-refresh reload actions, and standard text dragging, while securing notch boundaries via environment safe-area offsets (`env(safe-area-inset-*)`).

---

## 📂 Repository Contents

This skill is structured to be instantly parsed by AI systems:

```text
portable-android-game-scaffold/
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

### Method 1: Local Skill Directory Reference (Gemini / Antigravity)
If you are running an agent platform that supports local plugin overrides:
1. Clone this repository into your local configurations directory:
   ```bash
   git clone https://github.com/ishanmanjrekar/portable-android-game-scaffold.git ~/.gemini/config/skills/web-2d-game-setup
   ```
2. The AI assistant will automatically discover the `/web-2d-game-setup` command, read the system guidelines in `SKILL.md`, and copy files from the `assets/` subdirectory when requested to build a new game!

### Method 2: System Prompt Context Feeding (Generic AI Models)
If you are using a standard AI chat interface (like ChatGPT or Claude.ai) to scaffold a game:
1. Copy the entire contents of [SKILL.md](./SKILL.md).
2. Paste it as a system instruction or context header, saying:
   > *"Act as an expert Game Architect. Follow the instructions and template structures in the text below to scaffold a new cross-platform React 2D game project for me."*

---

## 📄 License
This repository is licensed under the MIT License - feel free to share, modify, and build custom AI-gamedev skill libraries!
