import { defineConfig } from '@playwright/experimental-ct-react';

import config from './playwright-base.config.ts';

config.testDir = './tests/components/';

const playwrightConfig = defineConfig(config);

export default playwrightConfig;
