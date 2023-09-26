import { PlaywrightTestConfig, devices } from '@playwright/test';

import viteConfig from './vite.config';

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    headless: true,
    contextOptions: {
      strictSelectors: true,
    },
    // @ts-expect-error not yet official
    ctViteConfig: viteConfig,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
};

export default config;
