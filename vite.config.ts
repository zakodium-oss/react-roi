import fs from 'node:fs';
import path from 'node:path';

import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';
import { defineConfig } from 'vitest/config';

const plugins = [react(), splitVendorChunkPlugin()];

const pages = fs.readdirSync(path.join(__dirname, 'pages'));

const rollupOptions = {
  input: {
    index: path.join(__dirname, 'index.html'),
    ...Object.fromEntries(
      pages.map((page) => [page, path.join(__dirname, 'pages', page)]),
    ),
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build: {
    target: 'esnext',
    minify: false,
    rollupOptions,
  },
  plugins,
  test: {
    include: ['./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
