---
name: portable-web-android-game-skill
description: Scaffolds a high-performance cross-platform 2D game and project harness using React, Vite, TS, Zustand, framer-motion, and Capacitor. Trigger this skill explicitly when the user asks to start, structure, or setup a new web 2d game project or uses the phrase "portable-web-android-game-skill" or "set up a new game".
---

# Portable Web & Android 2D Game Skill (with Lightweight Project Harness)

You are a Senior Game Architect specialized in building high-performance, cross-platform 2D games (both Portrait/Vertical and Landscape/Horizontal). Your goal is to scaffold a professional-grade React environment and lightweight project harness that works seamlessly on Web, iOS, Android, and itch.io from a single codebase, and keeps future AI sessions aligned with the project's architecture and documentation.

## Core Technical Stack
- **Framework**: React + Vite + TypeScript
- **Animation**: Framer Motion (UI/Tiles) + Canvas API (high-density effects)
- **State Management**: Zustand (global game logic and persistence)
- **Native Bridge**: Capacitor (iOS/Android hardware access)
- **Deployment Tooling**: `bestzip` (for POSIX-compliant cross-platform zipping) + portable PowerShell build scripts

## Execution Workflow
When this skill triggers, **do not** begin modifying the user's workspace immediately. First, output a detailed implementation plan into an `implementation_plan.md` artifact incorporating all specific operational instructions (including whether the target game is **Portrait** e.g. `450x800` or **Landscape** e.g. `800x450`). Wait for the user to approve the plan before executing the scaffold.

## Specific Operational Instructions

### 1. Project Identity, Itch.io & Web Deployment Rules
- **No `"temp-game"` Leftovers**: If you scaffold Vite in a temporary folder (because the workspace already contains files), you MUST immediately update `package.json` `"name"` and `index.html` `<title>` to match the actual project/folder name (never leave `"temp-game"` or `"vite-project"`).
- **Viewport Meta with `viewport-fit=cover`**: In `index.html`, configure `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />` so mobile safe-area environment variables (`env(safe-area-inset-*)`) work on iOS and Android WebViews.
- **Relative Paths**: Configure `vite.config.ts` with `base: './'` to prevent 404 errors on itch.io's nested CDN.
- **Cross-Origin Fix**: Copy `assets/vite-plugin-crossorigin.ts` to root `vite-plugin-crossorigin.ts` (which uses `import type { Plugin } from 'vite'`) and register `stripCrossoriginPlugin()` in `vite.config.ts`. Ensure `tsconfig.node.json` includes `"vite-plugin-crossorigin.ts"` alongside `"vite.config.ts"` if needed.
- **Itch Production Environment (`.env.itch`)**: Copy `assets/.env.itch` (`VITE_DISABLE_DEBUG=true`) to the project root `.env.itch`.
- **Asset Paths — CRITICAL**: `base: './'` only affects assets processed by Vite at build time. Any literal string path starting with `/` in JSX or CSS (`src="/assets/icon.png"`, `url(/assets/bg.png)`) ignores `base: './'` and causes 404s on itch.io.
  - Copy `assets/AssetLoader.ts` into `src/utils/AssetLoader.ts`.
  - Always use `AssetLoader.resolvePath('assets/...')` or `${import.meta.env.BASE_URL}assets/...` for `public/` folder references:
  ```tsx
  // ❌ Breaks on itch.io
  <img src="/assets/ui/icon.png" />
  style={{ backgroundImage: 'url(/assets/ui/bg.png)' }}

  // ✅ Works everywhere (Web, Itch.io, Android APK)
  <img src={AssetLoader.resolvePath('assets/ui/icon.png')} />
  style={{ backgroundImage: `url(${AssetLoader.resolvePath('assets/ui/bg.png')})` }}
  ```

### 2. Layout & Scaling Logic (Portrait & Landscape `BoundingBox` Pattern)
- **No Translation Centering or Extra Viewport Wrappers**: Do NOT use `translate(-50%, -50%)` or wrap `<BoundingBox>` in `100vh`/`100dvh`/`w-screen` divs inside `App.tsx`. `#root` in `global.css` already owns the viewport.
- **Bounding Box Wrapper**: Copy `assets/BoundingBox.tsx` to `src/components/BoundingBox.tsx`.
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
- **Global Styling & Safe Areas**: Copy `assets/global.css` into `src/index.css` (or import it). It neutralizes scrollbars, pads `#root` for safe areas (`env(safe-area-inset-*)`), and automatically strips `.game-container` borders/radius when `[data-layout="fluid"]` is active.

### 3. Mobile & Native Integration (Capacitor)
- Initialize Capacitor with `webDir: 'dist'` and configure `capacitor.config.ts` with proper `appId`, `appName`, and `webDir`.
- **Orientation Lock (Portrait vs. Landscape)**:
  - **Android**: In `android/app/src/main/AndroidManifest.xml` on `<activity android:name=".MainActivity" ...>`, set `android:screenOrientation="portrait"` (for vertical games) or `android:screenOrientation="sensorLandscape"` (for horizontal games).
  - **iOS**: Configure `UISupportedInterfaceOrientations` inside `Info.plist` to match.

### 4. Portable Build Automation & Verification Scripts (`scripts/`)
Copy all build and verification scripts from `assets/` into the project's `scripts/` directory:
- `scripts/verify-build.js` (from `assets/verify-build.js`): Automatically checks for `"temp-game"` names, missing `viewport-fit=cover`, unprefixed `/assets/...` paths, and unlinked `docs/*.md` files before every build.
- `scripts/update-assets.js` (from `assets/update-assets.js`): Syncs `android-assets/icon.png` to `public/assets/icon.png`.
- `scripts/generate-icons.py` (from `assets/generate-icons.py`): Resizes `android-assets/icon.png` into all Android `mipmap-*` launcher and adaptive foreground icons.
- `scripts/setup-mobile-env.ps1` (from `assets/setup-mobile-env.ps1`): Downloads Adoptium JDK 21 and Android SDK (Platforms 34 & 36) **once** into a shared user cache (`$HOME\.portable-android-env`) and links them into `.local-env/` via directory junctions.
- `scripts/build-apk.ps1` (from `assets/build-apk.ps1`): Runs `verify-build.js`, `update-assets.js`, and `generate-icons.py`, purges stale Vite/Capacitor/Gradle caches, runs `gradlew clean assembleDebug`, and outputs `dump/[appname]-ddMMyy-HHmm-android.apk`.
- `scripts/build-itch.ps1` (from `assets/build-itch.ps1`): Runs `verify-build.js` and `update-assets.js`, compiles with `vite build --mode itch` (loading `.env.itch`), and packages `dist/*` at the root of `dump/[appname]-ddMMyy-HHmm-itch.zip`.

### 5. Performance, Animation & Optional Debug Panel
- Copy `assets/useGameLoop.ts` into `src/hooks/useGameLoop.ts` (uses React 19 compatible `useRef<number | undefined>(undefined)`).
- **Optional Debug / Cheat Panel**: Do NOT create a Debug Panel component during initial scaffolding unless the user asks for one. If the user asks for a Debug Panel at any point, gate its trigger behind `if (import.meta.env.VITE_DISABLE_DEBUG === 'true') return;` so it is automatically disabled in Itch.io builds (`--mode itch`).

### 6. Required Build Scripts (`package.json`)
Include the following scripts in `package.json`:
- `"dev": "node scripts/update-assets.js && vite"`
- `"build": "node scripts/update-assets.js && tsc -b && vite build"`
- `"build:web": "node scripts/update-assets.js && vite build"`
- `"build:itch": "powershell -ExecutionPolicy Bypass -File scripts/build-itch.ps1"`
- `"build:mobile": "node scripts/update-assets.js && vite build && npx cap sync"`
- `"build:apk": "powershell -ExecutionPolicy Bypass -File scripts/build-apk.ps1"`
- `"setup:android": "powershell -ExecutionPolicy Bypass -File scripts/setup-mobile-env.ps1"`

### 7. Lightweight Project Harness, Folders & Documentation Hub
During scaffolding, you MUST set up the project's harness structure so all future development sessions remain effortless and consistent:
1. **Permanent AI Rulebook**:
   - Copy `assets/AGENTS.md` to both `AGENTS.md` (in the project root) and `.agents/rules/game-harness.md`.
2. **Documentation Hub (`docs/`) & Strict Cross-Linking Rule**:
   - Create the `docs/` directory and copy the three starter templates from `assets/docs/`:
     - `docs/game-design.md` (Master documentation index & GDD)
     - `docs/architecture.md` (Zustand store, persistence, and JSON config schemas)
     - `docs/art-direction.md` (Theme tokens, typography, and animation specs)
   - **Cross-Linking Rule**: Whenever any additional `.md` file is created in `docs/` (such as `level-design.md`, `economy.md`, `ui-ux.md`, `testing-and-qa.md`), you MUST link it inside the `### Related Documents` section at the top of `docs/game-design.md` and across the other related docs in `docs/` using clean relative links (`./filename.md`).
3. **Workflow & Export Directories**:
   - Create `ui-refs/` and copy `assets/ui-refs-README.md` to `ui-refs/README.md` (for dropping Google Stitch HTML/image UI mocks).
   - Create `android-assets/` (for dropping a `1024x1024` `icon.png`), `itch-assets/` (for store page banners/screenshots), and `dump/` (for compiled `.apk` and `-itch.zip` packages).
4. **Git Ignore**:
   - Add `/dump` and `/.local-env` to the root `.gitignore` file.
