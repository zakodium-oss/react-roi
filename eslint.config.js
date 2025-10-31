import { defineConfig } from 'eslint/config';
import react from 'eslint-config-zakodium/react';
import ts from 'eslint-config-zakodium/ts';

export default defineConfig(
  {
    ignores: [
      '.storybook',
      'storybook-static',
      'test-results',
      'public',
      'playwright',
      'lib-esm',
    ],
  },
  ts,
  react,
  {
    files: ['stories/**/*.tsx'],
    rules: {
      'react/no-unstable-nested-components': 'off',
    },
  },
);
