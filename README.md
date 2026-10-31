# 🤖 Portable Web & Android 2D Game Skill & Harness

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Web | Android | iOS](https://img.shields.io/badge/Platform-Web%20%7C%20Android%20%7C%20iOS-blue.svg)](#)
[![Stack: React + Vite + TypeScript](https://img.shields.io/badge/Stack-React%20%2B%20Vite%20%2B%20TypeScript-orange.svg)](#)

A cross-platform 2D game **scaffolding skill and lightweight development harness** for AI coding assistants (Antigravity, Gemini, Claude Code, Cursor, Windsurf).

Most game templates only set up Day-1 boilerplate—and then in later chat sessions, your AI forgets how your screen scaling, asset paths, and build scripts work. This repository solves that by doing **two things**:
1. **Day 1 (The Skill)**: Scaffolds a complete React + Vite + TypeScript + Zustand + Framer Motion + Capacitor 2D game (supporting both **Portrait/Vertical** and **Landscape/Horizontal** games) with zero-Android-Studio APK compilation and sandbox-safe Itch.io packaging.
2. **Day 2 to Launch (The Harness)**: Leaves behind a **permanent AI rulebook (`AGENTS.md`)**, a **connected documentation hub (`docs/`)**, a **UI reference drop folder (`ui-refs/`)**, and **automated pre-build inspectors (`verify-build.js`)** inside your new game repo—so every future chat session builds features, converts UI designs, and exports builds without back-and-forth fixes.

---

## 🌟 What the Harness Gives You

### 1. Persistent AI Memory Across Chat Sessions (`AGENTS.md` & `.agents/rules/`)
* **No More "Turn 2 Amnesia"**: When the skill scaffolds your game, it installs `AGENTS.md` and `.agents/rules/game-harness.md` directly into your new game repository.
* **Automatic Guardrails**: Even if you open a brand-new chat session days later without calling this skill again, the AI working in your game repo automatically knows to use container queries (`cqw`/`cqh`) instead of broken desktop `sm:`/`lg:` breakpoints, use `AssetLoader.resolvePath()` for Itch.io compatibility, and keep your `docs/` cross-linked.

### 2. Portrait & Landscape Bounding Box Scaling
* **Desktop Web & Desktop Itch.io**: Renders the game inside an aspect-ratio-locked virtual viewport (`450×800` for Portrait or `800×450` for Landscape) with simulated device framing and `containerType: 'size'`.
* **Mobile Web, Mobile Itch.io & Native APK**: Automatically detects phones/tablets in both vertical and horizontal orientations (`data-layout="fluid"`), stripping outer borders and unlocking 100% fluid, edge-to-edge rendering around camera notches and home bars (`env(safe-area-inset-*)`).

### 3. Connected Documentation Hub (`docs/`) & UI Reference Drop (`ui-refs/`)
* **Living Game Docs**: Pre-populates `docs/game-design.md`, `docs/architecture.md`, and `docs/art-direction.md`. Whenever you ask the AI to create new docs later (like `level-design.md`, `economy.md`, or `ui-ux.md`), the harness rules ensure they are automatically linked in `docs/game-design.md`.
* **Google Stitch / UI Mock Conversion (`ui-refs/`)**: Drop HTML/Tailwind exports or screenshots into `ui-refs/`, and the harness rules instruct the AI how to strip desktop viewport wrappers and adapt them cleanly into `<BoundingBox>`.

### 4. Zero-Android-Studio APK & One-Click Itch.io Exports
* **Space-Saving Shared Android Toolkit**: `setup-mobile-env.ps1` downloads Adoptium OpenJDK 21 and Android Command Line Tools (Platforms 34 & 36) **once** into `$HOME\.portable-android-env` and links them into each game's `/.local-env/` folder in ~1 second—saving 500MB+ of disk space per game.
* **Automatic Pre-Build Inspector (`verify-build.js`)**: Runs before every Itch or APK build to auto-fix leftover `"temp-game"` names, verify `viewport-fit=cover`, warn on broken `/assets/...` paths, and check that all `docs/*.md` files are linked in `docs/game-design.md`.
* **Automatic Icon Pipeline & Production Switch**: Resizes `android-assets/icon.png` into all Android `mipmap-*` folders and web assets, and uses `.env.itch` (`VITE_DISABLE_DEBUG=true`) to automatically disable optional developer cheat menus in public Itch.io ZIP exports.

---

## 🔄 The End-to-End Game Building Workflow

Once you scaffold a project with this harness, here is how you build and ship a game effortlessly:

```text
[1. Scaffold Game] ──► [2. Fill docs/ & ui-refs/] ──► [3. Build Loops & Views] ──► [4. Drop icon.png] ──► [5. Export Itch & APK]
```

### Step 1: Scaffold the Project (Once per Game)
Trigger `portable-web-android-game-skill` and tell the AI your game concept and whether it is **Portrait (Vertical)** or **Landscape (Horizontal)**. It creates this workspace for you:

```text
your-new-game/
├── AGENTS.md                        # Permanent AI rulebook read automatically in future chats
├── .agents/rules/game-harness.md    # Auto-loaded workspace rules for Antigravity / Cursor
├── .env.itch                        # Auto-disables debug/cheat menus on Itch.io exports
├── docs/                            # Connected documentation hub
│   ├── game-design.md               # Master index, core loop, mechanics & progression
│   ├── architecture.md              # Zustand store, persistence & JSON config schemas
│   └── art-direction.md             # Theme tokens, typography & animation specs
├── ui-refs/                         # Drop Google Stitch HTML/image mocks here
├── android-assets/                  # Drop your 1024x1024 icon.png here
├── itch-assets/                     # Store page banners, cover images & screenshots
├── dump/                            # Where finished .apk and -itch.zip files are saved
└── scripts/                         # Pre-build inspector, icon generator & export scripts
```

### Step 2: Iterate on Game Design & Architecture (`docs/`)
Ask the AI in any chat session:
> *"Update `docs/game-design.md` with our core loop, and create a `docs/economy.md` file for our XP and shop formulas."*
* Because of the harness rules in `AGENTS.md`, the AI will automatically link `economy.md` inside `docs/game-design.md` and keep all config numbers in `src/config/*.json`.

### Step 3: Convert UI Mocks into Screens (`ui-refs/`)
Export your screen designs (e.g., from **Google Stitch**) as HTML or PNGs and drop them into `ui-refs/`. Then ask the AI:
> *"Implement the main board screen using the reference in `ui-refs/`."*
* The harness rules ensure the AI strips out broken `100dvh` wrappers and `sm:`/`lg:` desktop media queries so the screen scales properly inside `<BoundingBox>` on both desktop and mobile.

### Step 4: Add a Debug Panel or Custom Icon (Optional)
* **Need a Cheat/Testing Menu?** Just ask: *"Add a debug panel to test level-ups and refill energy."* The harness rules tell the AI how to wire a triple-tap trigger gated by `VITE_DISABLE_DEBUG` so it automatically turns off in Itch.io builds.
* **Have a Game Icon?** Drop a `1024×1024` `icon.png` into `android-assets/icon.png`. The build scripts will automatically resize it for Android home screens and sync it to your web splash screen.

### Step 5: One-Command Exports (`dump/`)
Run these commands (or ask the AI to run them) whenever you want a build:
* **Export for Itch.io**:
  ```bash
  npm run build:itch
  ```
  Runs `verify-build.js`, disables debug menus via `.env.itch`, compiles the bundle, and outputs `dump/[gamename]-ddMMyy-HHmm-itch.zip` (with `index.html` at the zip root, ready to upload).
* **Export for Android APK**:
  ```bash
  npm run build:apk
  ```
  Links the shared JDK 21 / Android SDK cache into `.local-env/`, generates launcher icons from `android-assets/icon.png`, purges stale Gradle/Capacitor caches, compiles the native debug APK, and outputs `dump/[gamename]-ddMMyy-HHmm-android.apk`.

---

## 📂 Skill Repository Contents

```text
portable-web-android-game-skill/
├── SKILL.md                        # Master instructions executed when scaffolding a game
└── assets/                         # Harness & template files injected into new game projects
    ├── AGENTS.md                   # Permanent project rules dropped into the new game repo
    ├── BoundingBox.tsx             # Portrait/Landscape dual-mode scaling & @container component
    ├── global.css                  # Touch preventing, scrollbar neutralizing, safe area styles
    ├── useGameLoop.ts              # React 19 compatible requestAnimationFrame game loop hook
    ├── AssetLoader.ts              # Itch.io-safe image & audio preloader (BASE_URL aware)
    ├── vite-plugin-crossorigin.ts  # Itch.io CORS/sandbox script attribute stripper plugin
    ├── .env.itch                   # Auto-disables debug/cheat panels in Itch builds
    ├── verify-build.js             # Pre-flight inspector for paths, names, and doc links
    ├── update-assets.js            # Syncs android-assets/icon.png to web public assets
    ├── generate-icons.py           # Generates Android mipmap launcher icons from icon.png
    ├── setup-mobile-env.ps1        # Shared cache JDK 21 & Android SDK (34/36) bootstrapper
    ├── build-apk.ps1               # Cache-purging native Android APK compiler & packager
    ├── build-itch.ps1              # Root-level Itch.io ZIP packager script
    ├── ui-refs-README.md           # Instructions for converting Stitch/UI mocks in ui-refs/
    └── docs/                       # Starter documentation templates with cross-linking
        ├── game-design.md          # Master index & Game Design Document template
        ├── architecture.md         # Zustand store, persistence & JSON schema template
        └── art-direction.md        # Theme tokens, typography & animation spec template
```

---

## 🚀 How to Install & Trigger This Skill in Any AI Tool

### 👶 Noob-Friendly: The "Just Tell the AI" Method (Easiest)
If you don't want to deal with command lines or cloning repositories, feed this repository URL directly to your AI:

1. Open your AI coding assistant (Antigravity, Cursor, Claude, ChatGPT, etc.).
2. Paste this prompt:
   > *"Please read the instructions and templates at https://github.com/ishanmanjrekar/portable-web-android-game-skill. Once you understand them, use them to scaffold a new portable 2D web and Android game harness for me in my current directory!"*

---

### 🛠️ Tool-Specific Setup Instructions

#### 1. Gemini / Antigravity (Local Skill Installation)
1. Clone this repository into your local skills directory:
   ```bash
   git clone https://github.com/ishanmanjrekar/portable-web-android-game-skill.git ~/.gemini/config/skills/portable-web-android-game-skill
   ```
2. In any new workspace, simply prompt the agent:
   > *"set up a new game"* or *"use portable-web-android-game-skill"*
   The agent will propose an implementation plan and scaffold the full game harness upon approval. After Day 1, the injected `AGENTS.md` and `.agents/rules/game-harness.md` files automatically guide the agent in every future session.

#### 2. Cursor & Windsurf (Editor-based AI)
* **Option A (URL Reference)**: In Composer/Chat, reference `@https://github.com/ishanmanjrekar/portable-web-android-game-skill` and ask: *"Use this skill to set up a new React 2D game project."*
* **Option B (Local Context)**: Clone this repo and reference `@SKILL.md Please scaffold the game using these instructions and the assets directory.`

#### 3. Claude Code (Terminal-based AI)
1. Clone this repository or point Claude Code to it:
   ```bash
   git clone https://github.com/ishanmanjrekar/portable-web-android-game-skill.git
   claude
   ```
2. Prompt Claude:
   > *"Read `portable-web-android-game-skill/SKILL.md` and use the templates in `portable-web-android-game-skill/assets` to scaffold a new game in my current directory."*

---

## 📄 License
This repository is licensed under the MIT License - feel free to share, modify, and build custom AI-gamedev skill libraries!
