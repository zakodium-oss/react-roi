import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Required
  stories: ['../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      strictMode: false,
    },
  },
  staticDirs: ['../public'],
};

export default config;
