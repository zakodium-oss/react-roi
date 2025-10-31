import { defineConfig } from '@playwright/experimental-ct-react';

import config from './playwright-base.config.ts';

config.testDir = './tests/components/';

export default defineConfig(config);
