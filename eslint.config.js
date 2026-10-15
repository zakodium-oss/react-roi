import { defineConfig } from 'eslint/config';
import react from 'eslint-config-zakodium/react';
import ts from 'eslint-config-zakodium/ts';
import unicorn from 'eslint-config-zakodium/unicorn';

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
  unicorn,
  ts,
  react,
  {
    rules: {
      'unicorn/prefer-query-selector': 'off',
      // This library is still compatible with react 18
      '@eslint-react/no-use-context': 'off',
      '@eslint-react/no-context-provider': 'off',
    },
  },
  {
    files: ['stories/**/*.tsx'],
    rules: {
      'react/no-unstable-nested-components': 'off',
      /**
       * Stories put callbacks and components inside the render function so that
       * the code tab has all the relevant code
       */
      'unicorn/consistent-function-scoping': 'off',
      '@eslint-react/no-nested-component-definitions': 'off',
      '@eslint-react/static-components': 'off',
    },
  },
);
