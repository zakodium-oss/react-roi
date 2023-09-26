import path from 'node:path';

import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';
import { defineConfig } from 'vitest/config';

const plugins = [react(), splitVendorChunkPlugin()];

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
    minify: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        index: path.join(__dirname, 'index.html'),
      },
    },
  },
  plugins,
});
