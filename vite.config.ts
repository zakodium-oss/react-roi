import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';
import { defineConfig } from 'vitest/config';

const plugins = [react(), splitVendorChunkPlugin()];

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build: {
    target: 'esnext',
    minify: false,
    sourcemap: true,
  },
  plugins,
});
