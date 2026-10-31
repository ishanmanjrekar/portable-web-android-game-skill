# Portable Web & Android 2D Game Starter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Platform: Web | Android | iOS | Itch.io](https://img.shields.io/badge/Platform-Web%20%7C%20Android%20%7C%20iOS%20%7C%20Itch.io-blue.svg)](#)
[![Stack: React 19 + Vite + TypeScript + Capacitor](https://img.shields.io/badge/Stack-React%2019%20%2B%20Vite%20%2B%20TypeScript%20%2B%20Capacitor-orange.svg)](#)

A cross-platform 2D game bootstrapper and AI-ready project template built with **React 19, Vite, TypeScript, Zustand, Framer Motion, and Capacitor**.

Scaffold a **Portrait (`450×800`)** or **Landscape (`800×450`)** 2D game that scales cleanly across desktop browsers, mobile web, Itch.io iframes, and native Android APKs—with one-command builds and built-in rules (`AGENTS.md` / `CLAUDE.md`) so AI coding agents stay aligned with your architecture.

---

## ⚡ Quick Start

> **Prerequisites:** [Node.js 18+](https://nodejs.org/), Git, PowerShell (built-in on Windows or `pwsh`), and Python 3 (`Pillow` for automatic Android icon resizing).

### Option 1: Run via CLI (Terminal)
In an empty project folder, clone this starter and run [`init-harness.mjs`](./init-harness.mjs):

```powershell
git clone https://github.com/ishanmanjrekar/portable-web-android-game-skill.git .temp-harness
node .temp-harness/init-harness.mjs --orientation portrait --name "my-game" --title "My Game"
Remove-Item -Recurse -Force .temp-harness
```
*(Use `--orientation landscape` for `800×450` horizontal games, or `--orientation portrait` for `450×800` vertical games.)*

### Option 2: Run with Any AI Coding Agent
Paste this prompt into **Claude Code, Cursor, Windsurf, Codex, Antigravity, or Copilot**:
> *"Set up a new 2D game in this directory using `https://github.com/ishanmanjrekar/portable-web-android-game-skill` (`init-harness.mjs`). Ask me for the game title and whether it should be portrait or landscape first."*

### Option 3: Install as a Reusable Agent Skill
To trigger this starter anytime by saying *"set up a new game"*, clone it into your agent's skills directory:
```bash
# Universal / Codex / Cursor / Antigravity
git clone https://github.com/ishanmanjrekar/portable-web-android-game-skill.git ~/.agents/skills/portable-web-android-game-skill

# Claude Code
git clone https://github.com/ishanmanjrekar/portable-web-android-game-skill.git ~/.claude/skills/portable-web-android-game-skill
```

---

## ✨ Features

* **Dual-Mode Responsive Scaling (`<BoundingBox>`)**:
  * **Desktop Web & Itch.io**: Renders inside an aspect-ratio-locked virtual viewport (`450×800` Portrait or `800×450` Landscape) with CSS container query support (`containerType: 'size'`).
  * **Mobile Web & Native APK**: Automatically switches to edge-to-edge fluid rendering (`data-layout="fluid"`) with notch and home-bar safe areas (`env(safe-area-inset-*)`).
* **Zero-Android-Studio APK Builds**:
  * `scripts/setup-mobile-env.ps1` downloads OpenJDK 21 and the Android SDK (Platforms 34 & 36) **once** into `$HOME/.portable-android-env` and links them into each project's `.local-env/` folder in ~1 second (saving 500MB+ per game).
  * Automatically resizes `android-assets/icon.png` (`1024×1024`) into all Android `mipmap-*` launcher icons and web splash assets.
* **Sandbox-Safe Itch.io Packaging**:
  * Configured with relative asset resolution (`AssetLoader.resolvePath()`), `base: './'`, CORS `crossorigin` stripping, and `.env.itch` (`VITE_DISABLE_DEBUG=true` to strip developer cheat menus from public builds).
* **Pre-Build Inspector (`scripts/verify-build.js`)**:
  * Runs automatically before every export to catch unprefixed `/assets/...` paths, leftover template names, missing `viewport-fit=cover` tags, and unlinked docs.
* **Built-In AI Project Guardrails (`AGENTS.md` & `CLAUDE.md`)**:
  * Pre-installs project rules into the generated game repo (`AGENTS.md`, `CLAUDE.md`, `.agents/rules/game-harness.md`) so any AI agent automatically uses container query units (`cqw`/`cqh`) instead of desktop media queries (`sm:`/`lg:`), keeps `docs/` cross-linked, and converts UI mocks from `ui-refs/` cleanly.

---

## 📦 Generated Project Structure

Running `init-harness.mjs` generates the following workspace:

```text
my-game/
├── AGENTS.md                        # Project rules for AI agents (Cursor, Codex, Antigravity, etc.)
├── CLAUDE.md                        # Project rules for Claude Code
├── .agents/rules/game-harness.md    # Auto-loaded workspace rules
├── .env.itch                        # Disables debug/cheat menus during Itch.io exports
├── src/
│   ├── components/BoundingBox.tsx   # Portrait/Landscape dual-mode viewport & @container wrapper
│   ├── hooks/useGameLoop.ts         # React 19 requestAnimationFrame delta-time loop
│   ├── store/gameStore.ts           # Persisted Zustand state store
│   ├── utils/AssetLoader.ts         # Base-URL-aware image & audio preloader
│   ├── App.tsx                      # Root layout wired with BoundingBox
│   └── global.css                   # Touch lock, safe-area variables & container styles
├── docs/                            # Connected documentation templates
│   ├── game-design.md               # Master index, core loop & progression
│   ├── architecture.md              # State store & JSON config schemas
│   └── art-direction.md             # Theme tokens, typography & animation specs
├── ui-refs/                         # Drop folder for HTML/image UI mocks (e.g. Google Stitch)
├── android-assets/                  # Place 1024x1024 icon.png here for automatic icon generation
├── itch-assets/                     # Store page banners, cover images & screenshots
├── scripts/                         # Pre-build inspector, icon generator & export scripts
└── dump/                            # Output directory for compiled .apk and -itch.zip files
```

---

## 🛠️ Commands & Workflow

Inside your generated game project:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the local Vite development server |
| `npm run verify` | Run `scripts/verify-build.js` to check asset paths, config names, and doc links |
| `npm run build:itch` | Verify project, strip debug menus via `.env.itch`, and output `dump/<name>-<timestamp>-itch.zip` |
| `npm run build:apk` | Link shared JDK/Android SDK, generate icons from `android-assets/icon.png`, and output `dump/<name>-<timestamp>-android.apk` |

### Typical Development Workflow
1. **Design & Config (`docs/` & `src/config/`)**: Define game mechanics in `docs/game-design.md` and keep tunable balance numbers in `src/config/*.json`.
2. **UI Conversion (`ui-refs/`)**: Drop HTML/Tailwind exports or screenshots into `ui-refs/` and ask your AI assistant to adapt them into `<BoundingBox>` components.
3. **App Icon (`android-assets/icon.png`)**: Drop a `1024×1024` PNG at `android-assets/icon.png`—the build scripts automatically generate Android launcher icons and sync web assets.
4. **Export (`dump/`)**: Run `npm run build:itch` or `npm run build:apk` to produce ready-to-upload builds in `dump/`.

---

## 📂 Template Repository Layout

This repository contains the bootstrapper script, skill definition, and starter templates:

```text
portable-web-android-game-skill/
├── init-harness.mjs                # Deterministic Node.js project bootstrapper
├── SKILL.md                        # Agent skill specification (for AI tools that support SKILL.md)
└── assets/                         # Starter source files, build scripts & rulebooks copied on init
```

---

## 📄 License

Licensed under the [MIT License](./LICENSE).
