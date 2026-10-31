# 🤖 Portable Web & Android 2D Game Skill & Harness

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Web | Android | iOS](https://img.shields.io/badge/Platform-Web%20%7C%20Android%20%7C%20iOS-blue.svg)](#)
[![Stack: React + Vite + TypeScript](https://img.shields.io/badge/Stack-React%20%2B%20Vite%20%2B%20TypeScript-orange.svg)](#)

A cross-platform 2D game **scaffolding skill and lightweight development harness** for AI coding assistants (Antigravity, Gemini, Claude Code, Cursor, Windsurf, ChatGPT).

> ### 🤖 Instructions for AI Coding Agents Reading This URL
> If a user asked you to set up a game using this repository URL (`https://github.com/ishanmanjrekar/portable-web-android-game-skill`), **do not** try to guess or scrape individual template files from GitHub's web interface.
> 1. Propose a brief implementation plan confirming the game's title, slug, and orientation (`portrait` `450x800` or `landscape` `800x450`).
> 2. Once approved, run the deterministic harness bootstrapper in the user's project directory:
>    ```powershell
>    git clone https://github.com/ishanmanjrekar/portable-web-android-game-skill.git .temp-harness
>    node .temp-harness/init-harness.mjs --orientation portrait --name "my-game" --title "My Game"
>    Remove-Item -Recurse -Force .temp-harness
>    ```
>    *(If the skill is already installed locally at `~/.gemini/config/skills/portable-web-android-game-skill`, simply run `node ~/.gemini/config/skills/portable-web-android-game-skill/init-harness.mjs ...` directly.)*

---

## 🌟 Why a Skill + Harness?

Most game templates only set up Day-1 boilerplate—and then in later chat sessions, your AI forgets how your screen scaling, asset paths, and build scripts work. This repository solves that by doing **two things**:
1. **Day 1 (The Skill & `init-harness.mjs`)**: Deterministically scaffolds a complete React 19 + Vite + TypeScript + Zustand + Framer Motion + Capacitor 2D game (supporting both **Portrait/Vertical** and **Landscape/Horizontal** games) with zero-Android-Studio APK compilation and sandbox-safe Itch.io packaging.
2. **Day 2 to Launch (The Harness)**: Leaves behind **permanent AI rulebooks (`AGENTS.md`, `CLAUDE.md`, `.agents/rules/game-harness.md`)**, a **connected documentation hub (`docs/`)**, a **UI reference drop folder (`ui-refs/`)**, and **automated pre-build inspectors (`verify-build.js`)** inside your new game repo—so every future chat session builds features, converts UI designs, and exports builds without back-and-forth fixes.

---

## 🛠️ Key Features & Architecture

### 1. Persistent AI Memory Across All Tools (`AGENTS.md`, `CLAUDE.md`, `.agents/rules/`)
* **No More "Turn 2 Amnesia"**: Installs `AGENTS.md`, `CLAUDE.md`, and `.agents/rules/game-harness.md` directly into your new game repository so **Antigravity, Claude Code, Cursor, and Codex** all load your project rules automatically in every future chat session.
* **Automatic Guardrails**: Even in a brand-new chat session days later, the AI automatically knows to use container queries (`cqw`/`cqh`) instead of broken desktop `sm:`/`lg:` breakpoints, use `AssetLoader.resolvePath()` for Itch.io compatibility, and keep your `docs/` cross-linked.

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
Trigger `portable-web-android-game-skill` (or give your AI the GitHub link) and tell the AI your game concept and whether it is **Portrait (Vertical)** or **Landscape (Horizontal)**. It creates this workspace for you:

```text
your-new-game/
├── AGENTS.md                        # Permanent AI rulebook (Antigravity, Cursor, Codex)
├── CLAUDE.md                        # Permanent AI rulebook (Claude Code)
├── .agents/rules/game-harness.md    # Auto-loaded workspace rules
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
* Because of the harness rules in `AGENTS.md` / `CLAUDE.md`, the AI will automatically link `economy.md` inside `docs/game-design.md` and keep all config numbers in `src/config/*.json`.

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
├── init-harness.mjs                # Deterministic Node.js bootstrapper for any AI agent
└── assets/                         # Harness & template files injected into new game projects
    ├── AGENTS.md                   # Permanent project rules (copied to AGENTS.md, CLAUDE.md, .agents/rules/)
    ├── App.tsx                     # Starter App component wired with BoundingBox & .game-container
    ├── gameStore.ts                # Starter persisted Zustand store
    ├── BoundingBox.tsx             # Portrait/Landscape dual-mode scaling & @container component
    ├── global.css                  # Touch preventing, scrollbar neutralizing, safe area styles
    ├── useGameLoop.ts              # React 19 compatible requestAnimationFrame game loop hook
    ├── AssetLoader.ts              # Itch.io-safe image & audio preloader (BASE_URL aware)
    ├── vite.config.ts              # Starter Vite config with base './' & stripCrossoriginPlugin
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
Open your AI coding assistant (Antigravity, Claude Code, Cursor, Windsurf, etc.) in your new project folder and paste:
> *"Please read https://github.com/ishanmanjrekar/portable-web-android-game-skill and use its `init-harness.mjs` bootstrapper to set up a new portable 2D web and Android game harness in my current directory!"*

---

### 🛠️ Tool-Specific Setup Instructions

#### 1. Gemini / Antigravity (Local Skill Installation)
1. Clone this repository into your local skills directory:
   ```bash
   git clone https://github.com/ishanmanjrekar/portable-web-android-game-skill.git ~/.gemini/config/skills/portable-web-android-game-skill
   ```
2. In any new workspace, simply prompt the agent:
   > *"set up a new game"* or *"use portable-web-android-game-skill"*

#### 2. Cursor & Windsurf (Editor-based AI)
* In Composer/Chat, reference `@https://github.com/ishanmanjrekar/portable-web-android-game-skill` and ask: *"Use this repo's `init-harness.mjs` to set up a new React 2D game project."*

#### 3. Claude Code (Terminal-based AI)
* Prompt Claude:
  > *"Clone `https://github.com/ishanmanjrekar/portable-web-android-game-skill.git` into `.temp-harness`, run `node .temp-harness/init-harness.mjs`, and remove `.temp-harness`."*

---

## 📄 License
This repository is licensed under the MIT License - feel free to share, modify, and build custom AI-gamedev skill libraries!
