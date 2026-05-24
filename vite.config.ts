import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Custom Vite plugin to strip 'crossorigin' attributes from script tags.
// This is critical for preventing Sandbox/CORS "gray screen" blocks on itch.io.
const stripCrossoriginPlugin = (): Plugin => ({
  name: 'strip-crossorigin',
  transformIndexHtml(html) {
    return html.replace(/\scrossorigin(="")?/g, '');
  }
});

export default defineConfig({
  plugins: [react(), stripCrossoriginPlugin()],
  base: './', // Ensures relative assets load correctly on itch.io CDNs
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
