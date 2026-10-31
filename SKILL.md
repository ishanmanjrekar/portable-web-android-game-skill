---
name: portable-web-android-game-skill
description: Scaffolds a high-performance cross-platform 2D game and project harness using React, Vite, TS, Zustand, framer-motion, and Capacitor. Trigger this skill explicitly when the user asks to start, structure, or setup a new web 2d game project or uses the phrase "portable-web-android-game-skill" or "set up a new game".
---

# Portable Web & Android 2D Game Skill & Harness

You are a Senior Game Architect specialized in building high-performance, cross-platform 2D games (both Portrait/Vertical and Landscape/Horizontal). Your goal is to scaffold a professional-grade React environment and lightweight project harness that works seamlessly on Web, iOS, Android, and itch.io from a single codebase, and keeps future AI sessions aligned with the project's architecture and documentation.

## Core Technical Stack
- **Framework**: React 19 + Vite + TypeScript
- **Animation**: Framer Motion (UI/Tiles) + Canvas API (high-density effects)
- **State Management**: Zustand (global game logic and persistence)
- **Native Bridge**: Capacitor (iOS/Android hardware access)
- **Deployment Tooling**: `bestzip` (for POSIX-compliant cross-platform zipping) + portable PowerShell build scripts

## Execution Workflow
When this skill triggers:
1. **Do not** begin modifying the user's workspace immediately. First, output a detailed implementation plan into an `implementation_plan.md` artifact incorporating the target orientation (**Portrait** `450x800` or **Landscape** `800x450`), game title/slug, and harness structure. Wait for the user to approve the plan.
2. **Once approved, execute the Deterministic Harness Bootstrapper (`init-harness.mjs`)**:
   - **If this skill is installed locally on disk** (for example at `~/.gemini/config/skills/portable-web-android-game-skill`):
     ```powershell
     node "<path-to-this-skill-folder>/init-harness.mjs" --orientation <portrait|landscape> --name "<game-slug>" --title "<Game Title>"
     ```
   - **If you were given the GitHub repository URL** (`https://github.com/ishanmanjrekar/portable-web-android-game-skill`):
     Do NOT try to manually guess or scrape individual files from GitHub web pages. Run:
     ```powershell
     git clone https://github.com/ishanmanjrekar/portable-web-android-game-skill.git .temp-harness
     node .temp-harness/init-harness.mjs --orientation <portrait|landscape> --name "<game-slug>" --title "<Game Title>"
     Remove-Item -Recurse -Force .temp-harness
     ```
   `init-harness.mjs` deterministically creates/updates `package.json`, `tsconfig*.json`, `vite.config.ts`, `index.html` (`viewport-fit=cover`), copies all `assets/` (`BoundingBox.tsx`, `useGameLoop.ts`, `AssetLoader.ts`, `global.css`, `App.tsx`, `gameStore.ts`, `scripts/*`, `.env.itch`), sets up `AGENTS.md`, `CLAUDE.md`, `.agents/rules/game-harness.md`, `docs/*`, `ui-refs/`, `android-assets/`, `itch-assets/`, `dump/`, installs npm dependencies, builds `dist/`, initializes Capacitor Android (`npx cap add android`), and locks `AndroidManifest.xml` orientation!

---

## Specific Operational Instructions & Architectural Rules

### 1. Project Identity, Itch.io & Web Deployment Rules
- **No `"temp-game"` Leftovers**: Ensure `package.json` `"name"` and `index.html` `<title>` match the actual project/folder name (never leave `"temp-game"` or `"vite-project"`).
- **Viewport Meta with `viewport-fit=cover`**: `index.html` MUST include `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />` so mobile safe-area environment variables (`env(safe-area-inset-*)`) work on iOS and Android WebViews.
- **Relative Paths & Cross-Origin Fix**: `vite.config.ts` uses `base: './'` and `stripCrossoriginPlugin()` from `vite-plugin-crossorigin.ts` to prevent 404s and CORS "Gray Screen" bugs on itch.io's sandboxed CDN.
- **Itch Production Environment (`.env.itch`)**: Root `.env.itch` contains `VITE_DISABLE_DEBUG=true` so `--mode itch` builds automatically strip developer cheat menus.
- **Asset Paths — CRITICAL**: `base: './'` only affects assets processed by Vite at build time. Any literal string path starting with `/` in JSX or CSS (`src="/assets/icon.png"`, `url(/assets/bg.png)`) ignores `base: './'` and causes 404s on itch.io. Always use `AssetLoader.resolvePath('assets/...')` or `${import.meta.env.BASE_URL}assets/...`:
  ```tsx
  import { AssetLoader } from './utils/AssetLoader';

  // ✅ Works everywhere (Web, Itch.io, Android APK)
  <img src={AssetLoader.resolvePath('assets/ui/icon.png')} />
  style={{ backgroundImage: `url(${AssetLoader.resolvePath('assets/ui/bg.png')})` }}
  ```

### 2. Layout & Scaling Logic (Portrait & Landscape `BoundingBox` Pattern)
- **No Translation Centering or Extra Viewport Wrappers**: Do NOT use `translate(-50%, -50%)` or wrap `<BoundingBox>` in `100vh`/`100dvh`/`w-screen` divs inside `App.tsx`. `#root` in `global.css` already owns the viewport.
- **Bounding Box Wrapper (`src/components/BoundingBox.tsx`)**:
  - Supports both **Portrait** (`width < height`, e.g., `width={450} height={800}`) and **Landscape** (`width > height`, e.g., `width={800} height={450}`).
  - Sets `containerType: 'size'` on the inner game box in both desktop and mobile modes so `cqw`, `cqh`, and `@container` queries always measure the game viewport, never the desktop monitor.
  - Sets `data-layout={isFluidLayout ? 'fluid' : 'framed'}` on the inner wrapper.
- **No Viewport Breakpoints (`sm:`, `md:`, `lg:`)**: Never use browser viewport media queries (`sm:`, `md:`, `lg:`, `vw`, `vh`) inside game components (especially when converting HTML mocks from `ui-refs/`). Use container query units (`cqw`, `cqh`), `clamp(...)`, and elastic Flexbox (`flex-1 min-h-0` for the central board/canvas, `flex-none` for bolted top HUD and bottom controls).
- **Container Queries for Grids**: Grid layouts (e.g., tile matrices) MUST use CSS Container Queries (`container-type: size`) to auto-fit any aspect ratio:
  ```css
  .grid-container {
    width: min(100cqw, calc(100cqh * aspect_ratio));
    height: min(100cqh, calc(100cqw / aspect_ratio));
  }
  ```

### 3. Mobile & Native Integration (Capacitor)
- Capacitor is initialized with `webDir: 'dist'` in `capacitor.config.ts`.
- **Orientation Lock (Portrait vs. Landscape)**:
  - **Android**: In `android/app/src/main/AndroidManifest.xml` on `<activity android:name=".MainActivity" ...>`, set `android:screenOrientation="portrait"` (for vertical games) or `android:screenOrientation="sensorLandscape"` (for horizontal games).
  - **iOS**: Configure `UISupportedInterfaceOrientations` inside `Info.plist` to match.

### 4. Portable Build Automation & Verification Scripts (`scripts/`)
- `scripts/verify-build.js`: Automatically checks for `"temp-game"` names, missing `viewport-fit=cover`, unprefixed `/assets/...` paths, and unlinked `docs/*.md` files before every build.
- `scripts/update-assets.js` & `scripts/generate-icons.py`: Syncs `android-assets/icon.png` to `public/assets/icon.png` and resizes it into all Android `mipmap-*` launcher and adaptive foreground icons.
- `scripts/setup-mobile-env.ps1`: Downloads Adoptium JDK 21 and Android SDK (Platforms 34 & 36) **once** into a shared user cache (`$HOME\.portable-android-env`) and links them into `.local-env/` via directory junctions.
- `scripts/build-apk.ps1`: Runs `verify-build.js`, `update-assets.js`, and `generate-icons.py`, purges stale Vite/Capacitor/Gradle caches, runs `gradlew clean assembleDebug`, and outputs `dump/[appname]-ddMMyy-HHmm-android.apk`.
- `scripts/build-itch.ps1`: Runs `verify-build.js` and `update-assets.js`, compiles with `vite build --mode itch` (loading `.env.itch`), and packages `dist/*` at the root of `dump/[appname]-ddMMyy-HHmm-itch.zip`.

### 5. Performance, Animation & Optional Debug Panel
- `src/hooks/useGameLoop.ts` provides a `requestAnimationFrame` delta loop (React 19 compatible).
- **Optional Debug / Cheat Panel**: Do NOT create a Debug Panel component during initial scaffolding unless the user asks for one. If the user asks for a Debug Panel at any point, gate its trigger behind `if (import.meta.env.VITE_DISABLE_DEBUG === 'true') return;` so it is automatically disabled in Itch.io builds (`--mode itch`).

### 6. Lightweight Project Harness, Folders & Documentation Hub
The scaffolded project includes:
1. **Permanent AI Rulebooks**: `AGENTS.md`, `CLAUDE.md`, and `.agents/rules/game-harness.md` so Antigravity, Claude Code, Cursor, and Codex automatically load the project rules in every future session.
2. **Documentation Hub (`docs/`) & Strict Cross-Linking Rule**:
   - Starter docs: `docs/game-design.md`, `docs/architecture.md`, `docs/art-direction.md`.
   - **Cross-Linking Rule**: Whenever any additional `.md` file is created in `docs/` (such as `level-design.md`, `economy.md`, `ui-ux.md`, `testing-and-qa.md`), you MUST link it inside the `### Related Documents` section at the top of `docs/game-design.md` and across the other related docs in `docs/` using clean relative links (`./filename.md`).
3. **Workflow & Export Directories**: `ui-refs/` (with `ui-refs/README.md`), `android-assets/`, `itch-assets/`, and `dump/` (with `/dump` and `/.local-env` in `.gitignore`).
