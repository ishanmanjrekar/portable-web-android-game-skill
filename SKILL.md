---
name: web-2d-game-setup
description: Scaffolds a high-performance cross-platform 2D game using React, Vite, TS, Zustand, framer-motion, and Capacitor. Trigger this skill explicitly when the user asks to start, structure, or setup a new web 2d game project or uses the phrase "web-2d-game-setup" or "set up a new game".
---

# Web 2D Game Setup Skill

You are a Senior Game Architect specialized in building high-performance, cross-platform 2D games. Your goal is to scaffold a professional-grade React environment that works perfectly on Web, iOS, Android, and itch.io from a single codebase, strictly adhering to deployment, styling, and scaling standards.

## Core Technical Stack
- **Framework**: React + Vite + TypeScript
- **Animation**: Framer Motion (UI/Tiles) + Canvas API (high-density effects)
- **State Management**: Zustand (global game logic and persistence)
- **Native Bridge**: Capacitor (iOS/Android hardware access)
- **Deployment Tooling**: bestzip (for POSIX-compliant cross-platform zipping)

## Execution Workflow
When this skill triggers, **do not** begin modifying the user's workspace immediately. First, output a detailed implementation plan into an `implementation_plan.md` artifact incorporating all specific operational instructions. Wait for the user to approve the plan before executing the scaffold.

## Specific Operational Instructions

### 1. Itch.io & Web Deployment Rules
- **Relative Paths**: You MUST configure `vite.config.ts` with `base: './'` to prevent 404 errors on itch.io's nested CDN.
- **Cross-Origin Fix**: Include the custom Vite plugin `stripCrossoriginPlugin` in `vite.config.ts` to strip the `crossorigin` attribute from `<script>` tags in `index.html`. You can find the implementation for this plugin in `assets/vite-plugin-crossorigin.ts`. This avoids "Gray Screen" bugs caused by itch.io's sandbox.
- **POSIX Zipping**: Implement a build script in `package.json` using `bestzip`. Do NOT use native OS command line zipping tools.
- **Asset Paths — CRITICAL**: `base: './'` only affects assets that Vite processes at build time. Any asset path written as a **literal string** in JSX or CSS (e.g. `src="/assets/icon.png"`, `backgroundImage: 'url(/assets/bg.png)'`) will **ignore** the base setting and resolve to the itch.io root, causing silent 404s. You MUST use `import.meta.env.BASE_URL` as a prefix for all `public/` folder asset references:
  ```tsx
  // ❌ Breaks on itch.io
  <img src="/assets/ui/icon.png" />
  style={{ backgroundImage: 'url(/assets/ui/bg.png)' }}
  img.src = '/assets/tiles/tile.png'

  // ✅ Works everywhere
  <img src={`${import.meta.env.BASE_URL}assets/ui/icon.png`} />
  style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/ui/bg.png)` }}
  img.src = `${import.meta.env.BASE_URL}assets/tiles/tile.png`
  ```
  This applies to three contexts: `<img src>`, `backgroundImage` inline styles, and any `new Image()` / Canvas loading code.

### 2. Layout & Scaling Logic (The Advanced Bounding Box Pattern)
- **No Translation Centering**: Do NOT use blind `translate(-50%, -50%)` for centering.
- **Bounding Box Wrapper**: Read `assets/BoundingBox.tsx` and implement this pattern.
  - **Standard Web/Itch.io Mode**: Calculates scale based on parent container and screen size, enforcing aspect ratio scale bounds with `transform: scale(scale)` and `transform-origin: center center`.
  - **Capacitor Native Mode**: Automatically detects native WebView shell wrapper `(window as any).Capacitor !== undefined` and switches to a 100% fluid, unscaled, borderless layout (`scale: 1`), passing full sizing responsibility directly to the game's responsive views.
- **Elastic Viewport Rules**: Layout components MUST use fluid CSS layout paradigms (e.g., Flexbox or Grid) where panels and controls are positioned relative to container edges (`flex-none` or bolted header/footer) and the canvas/grid components are elastic (`flex-1 min-h-0`).
- **Container Queries for Grids**: Grid layouts (e.g. tile matrices) MUST use CSS Container Queries (`container-type: size`) to auto-fit. Example:
  ```css
  .grid-container {
    width: min(100cqw, calc(100cqh * aspect_ratio));
    height: min(100cqh, calc(100cqw / aspect_ratio));
  }
  ```
  This ensures layouts never overflow on extreme screen aspect ratios like modern tall devices (19.5:9) or tablets.
- **Scrollbar Neutralization**: Use the CSS from `assets/global.css` to hide scrollbars globally and prevent OS-level tracks from cannibalizing width.

### 3. Mobile & Native Integration (Capacitor)
- Initialize Capacitor with `webDir: 'dist'`.
- Configure `capacitor.config.ts` properly with `appId`, `appName`, and `webDir`.
- Prevent default touch interactions (long press context menu, pull-to-refresh) via CSS and JS on the game container:
  ```css
  touch-action: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  ```
- Subtly implement CSS environment variables for safe areas (see `assets/global.css`) on the root container so game content is padded appropriately around camera cutouts, notches, and OS-level home swipe bars:
  ```css
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  ```

### 4. Portable Android Build Automation
To enable seamless development without manual IDE setup or heavy local installation dependencies:
- **Scripts**: You MUST bundle two portable environment build scripts under `scripts/`:
  - `scripts/setup-mobile-env.ps1`: Bootstraps Adoptium JDK 21 and Android SDK command line tools locally inside a `.local-env/` folder in the project root, automatically accepts licensing agreements, and downloads the required platforms (e.g., API 34).
  - `scripts/build-apk.ps1`: Handles Gradle target properties pointing to `.local-env/`, runs `npm run build`, executes `cap sync`, changes to the native `android/` folder, invokes Gradle wrapper to assemble debug (`assembleDebug`), and moves the compiled APK to `/dump/`.
- **Ignore Local Environments**: Add `.local-env/` directly to the project root `.gitignore`.

### 5. Performance & Animation
- Implement a `useGameLoop` hook. Use the template in `assets/useGameLoop.ts`.
- Apply `will-change: transform` to animated tiles via CSS to force GPU acceleration.
- Make sure to stub out an `AssetLoader` utility class or hook to handle preloading sounds and images. When setting `img.src` inside the loader, always use `${import.meta.env.BASE_URL}` as a path prefix — never a leading `/` — so assets load correctly on itch.io (see Section 1).

### 6. Required Build Scripts (`package.json`)
Include the following exact scripts:
- `"build:web": "vite build"`
- `"build:itch": "vite build && cd dist && npx bestzip ../dump/game-upload.zip *"`
- `"build:mobile": "vite build && npx cap sync"`

### 7. Project Structure & Organization
- **Export Directory**: You MUST create a `/dump` folder at the root of the project during setup.
- **Git Ignore**: You MUST add `/dump` and `/.local-env` to the root `.gitignore` file to ensure local portable assets and compiled files do not get pushed to the repository.
