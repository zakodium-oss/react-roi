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
    sourcemap: true,
  },
  plugins,
});
