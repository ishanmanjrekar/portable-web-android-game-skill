#!/usr/bin/env node
/**
 * Deterministic Bootstrapper for Portable Web & Android 2D Game Skill & Harness
 * Usage:
 *   node <path-to-skill>/init-harness.mjs [--orientation portrait|landscape] [--name my-game] [--app-id com.example.mygame] [--target .]
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate assets directory whether run from repo root or inside assets/
const assetsDir = fs.existsSync(path.join(__dirname, 'assets', 'BoundingBox.tsx'))
  ? path.join(__dirname, 'assets')
  : __dirname;

// Parse CLI flags
const args = process.argv.slice(2);
function getFlag(flag, defaultVal) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return defaultVal;
}

const targetDir = path.resolve(getFlag('--target', process.cwd()));
const rawFolderName = path.basename(targetDir);
const defaultSlug = rawFolderName.toLowerCase().replace(/[^a-z0-9-_]/g, '-') || 'my-2d-game';
const appNameSlug = getFlag('--name', defaultSlug).toLowerCase().replace(/[^a-z0-9-_]/g, '-');
const appDisplayName = getFlag('--title', rawFolderName || 'My 2D Game');
const orientation = getFlag('--orientation', 'portrait').toLowerCase() === 'landscape' ? 'landscape' : 'portrait';
const defaultAppId = `com.game.${appNameSlug.replace(/[^a-z0-9]/g, '') || 'app'}`;
const appId = getFlag('--app-id', defaultAppId);

const boxWidth = orientation === 'landscape' ? 800 : 450;
const boxHeight = orientation === 'landscape' ? 450 : 800;
const androidOrientation = orientation === 'landscape' ? 'sensorLandscape' : 'portrait';

console.log('======================================================');
console.log('  INITIALIZING PORTABLE 2D GAME HARNESS               ');
console.log('======================================================');
console.log(`Target Directory : ${targetDir}`);
console.log(`Game Name (slug) : ${appNameSlug}`);
console.log(`App ID           : ${appId}`);
console.log(`Orientation      : ${orientation} (${boxWidth}x${boxHeight})`);
console.log('------------------------------------------------------');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyAsset(assetRelPath, destRelPath, overwrite = true) {
  const src = path.join(assetsDir, assetRelPath);
  const dest = path.join(targetDir, destRelPath);
  ensureDir(path.dirname(dest));
  if (!overwrite && fs.existsSync(dest)) {
    console.log(`[Skip] ${destRelPath} already exists.`);
    return;
  }
  fs.copyFileSync(src, dest);
  console.log(`[Copied] ${destRelPath}`);
}

ensureDir(targetDir);

// 1. Create or update package.json
const pkgPath = path.join(targetDir, 'package.json');
const pkgTemplate = {
  name: appNameSlug,
  private: true,
  version: '0.1.0',
  type: 'module',
  scripts: {
    dev: 'node scripts/update-assets.js && vite',
    verify: 'node scripts/verify-build.js',
    build: 'node scripts/update-assets.js && tsc -b && vite build',
    'build:web': 'node scripts/update-assets.js && vite build',
    'build:itch': 'powershell -ExecutionPolicy Bypass -File scripts/build-itch.ps1',
    'build:mobile': 'node scripts/update-assets.js && vite build && npx cap sync',
    'build:apk': 'powershell -ExecutionPolicy Bypass -File scripts/build-apk.ps1',
    'setup:android': 'powershell -ExecutionPolicy Bypass -File scripts/setup-mobile-env.ps1',
    preview: 'vite preview',
  },
  dependencies: {
    '@capacitor/core': '^8.0.0',
    'framer-motion': '^12.0.0',
    react: '^19.0.0',
    'react-dom': '^19.0.0',
    zustand: '^5.0.0',
  },
  devDependencies: {
    '@capacitor/android': '^8.0.0',
    '@capacitor/cli': '^8.0.0',
    '@types/node': '^22.0.0',
    '@types/react': '^19.0.0',
    '@types/react-dom': '^19.0.0',
    '@vitejs/plugin-react': '^4.3.0',
    bestzip: '^2.2.1',
    typescript: '~5.7.0',
    vite: '^6.0.0',
  },
};

if (!fs.existsSync(pkgPath)) {
  fs.writeFileSync(pkgPath, JSON.stringify(pkgTemplate, null, 2) + '\n', 'utf8');
  console.log('[Created] package.json');
} else {
  const existingPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (!existingPkg.name || existingPkg.name === 'temp-game' || existingPkg.name === 'vite-project') {
    existingPkg.name = appNameSlug;
  }
  existingPkg.type = 'module';
  existingPkg.scripts = { ...(existingPkg.scripts || {}), ...pkgTemplate.scripts };
  existingPkg.dependencies = { ...pkgTemplate.dependencies, ...(existingPkg.dependencies || {}) };
  existingPkg.devDependencies = { ...pkgTemplate.devDependencies, ...(existingPkg.devDependencies || {}) };
  fs.writeFileSync(pkgPath, JSON.stringify(existingPkg, null, 2) + '\n', 'utf8');
  console.log('[Updated] package.json');
}

// 2. Create TypeScript & Vite Configs
const tsconfigJson = {
  files: [],
  references: [{ path: './tsconfig.app.json' }, { path: './tsconfig.node.json' }],
};
fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), JSON.stringify(tsconfigJson, null, 2) + '\n', 'utf8');

const tsconfigAppJson = {
  compilerOptions: {
    tsBuildInfoFile: './node_modules/.tmp/tsconfig.app.tsbuildinfo',
    target: 'ES2020',
    useDefineForClassFields: true,
    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
    module: 'ESNext',
    skipLibCheck: true,
    moduleResolution: 'bundler',
    allowImportingTsExtensions: true,
    isolatedModules: true,
    moduleDetection: 'force',
    noEmit: true,
    jsx: 'react-jsx',
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
  },
  include: ['src'],
};
fs.writeFileSync(path.join(targetDir, 'tsconfig.app.json'), JSON.stringify(tsconfigAppJson, null, 2) + '\n', 'utf8');

const tsconfigNodeJson = {
  compilerOptions: {
    tsBuildInfoFile: './node_modules/.tmp/tsconfig.node.tsbuildinfo',
    target: 'ES2022',
    lib: ['ES2023'],
    module: 'ESNext',
    skipLibCheck: true,
    moduleResolution: 'bundler',
    allowImportingTsExtensions: true,
    isolatedModules: true,
    moduleDetection: 'force',
    noEmit: true,
    strict: true,
  },
  include: ['vite.config.ts', 'vite-plugin-crossorigin.ts'],
};
fs.writeFileSync(path.join(targetDir, 'tsconfig.node.json'), JSON.stringify(tsconfigNodeJson, null, 2) + '\n', 'utf8');

// 3. Create index.html with viewport-fit=cover
const indexHtmlPath = path.join(targetDir, 'index.html');
const indexHtmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>${appDisplayName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
fs.writeFileSync(indexHtmlPath, indexHtmlContent, 'utf8');
console.log('[Configured] index.html (with viewport-fit=cover)');

// 4. Copy core harness & template files
copyAsset('vite-plugin-crossorigin.ts', 'vite-plugin-crossorigin.ts');
copyAsset('vite.config.ts', 'vite.config.ts');
copyAsset('.env.itch', '.env.itch');
copyAsset('BoundingBox.tsx', 'src/components/BoundingBox.tsx');
copyAsset('useGameLoop.ts', 'src/hooks/useGameLoop.ts');
copyAsset('AssetLoader.ts', 'src/utils/AssetLoader.ts');
copyAsset('gameStore.ts', 'src/store/gameStore.ts', false);
copyAsset('global.css', 'src/index.css');

// Configure App.tsx with target orientation dimensions
const appTsxTemplate = fs
  .readFileSync(path.join(assetsDir, 'App.tsx'), 'utf8')
  .replace('width={450} height={800}', `width={${boxWidth}} height={${boxHeight}}`);
const destAppTsx = path.join(targetDir, 'src', 'App.tsx');
ensureDir(path.dirname(destAppTsx));
fs.writeFileSync(destAppTsx, appTsxTemplate, 'utf8');
console.log(`[Configured] src/App.tsx (${boxWidth}x${boxHeight})`);

// Remove leftover default Vite App.css if present
const defaultAppCss = path.join(targetDir, 'src', 'App.css');
if (fs.existsSync(defaultAppCss)) {
  fs.unlinkSync(defaultAppCss);
}

// Ensure src/main.tsx and src/vite-env.d.ts exist
const mainTsxPath = path.join(targetDir, 'src', 'main.tsx');
if (!fs.existsSync(mainTsxPath)) {
  fs.writeFileSync(
    mainTsxPath,
    `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`,
    'utf8'
  );
}
fs.writeFileSync(path.join(targetDir, 'src', 'vite-env.d.ts'), '/// <reference types="vite/client" />\n', 'utf8');

// 5. Copy build & verification scripts
copyAsset('verify-build.js', 'scripts/verify-build.js');
copyAsset('update-assets.js', 'scripts/update-assets.js');
copyAsset('generate-icons.py', 'scripts/generate-icons.py');
copyAsset('setup-mobile-env.ps1', 'scripts/setup-mobile-env.ps1');
copyAsset('build-apk.ps1', 'scripts/build-apk.ps1');
copyAsset('build-itch.ps1', 'scripts/build-itch.ps1');

// 6. Set up AI Rulebooks (AGENTS.md, CLAUDE.md, .agents/rules/game-harness.md)
copyAsset('AGENTS.md', 'AGENTS.md');
copyAsset('AGENTS.md', 'CLAUDE.md');
copyAsset('AGENTS.md', '.agents/rules/game-harness.md');

// 7. Set up docs/ templates & workflow directories (ui-refs/, android-assets/, itch-assets/, dump/)
copyAsset('docs/game-design.md', 'docs/game-design.md', false);
copyAsset('docs/architecture.md', 'docs/architecture.md', false);
copyAsset('docs/art-direction.md', 'docs/art-direction.md', false);
copyAsset('ui-refs-README.md', 'ui-refs/README.md', false);
ensureDir(path.join(targetDir, 'android-assets'));
ensureDir(path.join(targetDir, 'itch-assets'));
ensureDir(path.join(targetDir, 'dump'));
ensureDir(path.join(targetDir, 'public', 'assets'));

// 8. Configure capacitor.config.ts & .gitignore
const capConfigContent = `import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: '${appId}',
  appName: '${appDisplayName.replace(/'/g, "\\'")}',
  webDir: 'dist',
};

export default config;
`;
fs.writeFileSync(path.join(targetDir, 'capacitor.config.ts'), capConfigContent, 'utf8');
console.log('[Configured] capacitor.config.ts');

const gitignorePath = path.join(targetDir, '.gitignore');
const requiredIgnores = ['node_modules', 'dist', 'dist-ssr', '*.local', '/dump', '/.local-env'];
let gitignoreContent = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';
for (const entry of requiredIgnores) {
  if (!gitignoreContent.includes(entry)) {
    gitignoreContent += (gitignoreContent.endsWith('\n') || !gitignoreContent ? '' : '\n') + entry + '\n';
  }
}
fs.writeFileSync(gitignorePath, gitignoreContent, 'utf8');
console.log('[Configured] .gitignore');

// 9. Install dependencies, run initial build, and initialize Capacitor Android
if (!args.includes('--skip-install')) {
  console.log('\n[1/3] Installing npm dependencies...');
  execSync('npm install', { cwd: targetDir, stdio: 'inherit' });

  console.log('\n[2/3] Running initial production web build...');
  execSync('npm run build', { cwd: targetDir, stdio: 'inherit' });

  const androidDir = path.join(targetDir, 'android');
  if (!fs.existsSync(androidDir)) {
    console.log('\n[3/3] Initializing Capacitor Android project...');
    execSync('npx cap add android', { cwd: targetDir, stdio: 'inherit' });
  } else {
    console.log('\n[3/3] Syncing Capacitor Android project...');
    execSync('npx cap sync android', { cwd: targetDir, stdio: 'inherit' });
  }

  // Lock orientation in AndroidManifest.xml
  const manifestPath = path.join(targetDir, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  if (fs.existsSync(manifestPath)) {
    let manifest = fs.readFileSync(manifestPath, 'utf8');
    if (!manifest.includes('android:screenOrientation=')) {
      manifest = manifest.replace(
        'android:name=".MainActivity"',
        `android:name=".MainActivity"\n            android:screenOrientation="${androidOrientation}"`
      );
      fs.writeFileSync(manifestPath, manifest, 'utf8');
      console.log(`[Configured] AndroidManifest.xml locked to android:screenOrientation="${androidOrientation}"`);
    }
  }
}

console.log('\n======================================================');
console.log('  PORTABLE 2D GAME HARNESS READY!                     ');
console.log('======================================================');

