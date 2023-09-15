import { test, expect } from '@playwright/experimental-ct-react';

import { Box } from '../../src/components/Box';

test('my test', async ({ mount }) => {
  const component = await mount(
    <Box
      id={'random_id'}
      x={2}
      y={2}
      width={10}
      height={10}
      style={{ backgroundColor: 'blue' }}
      label={'test'}
    />,
  );
  await expect(component).toBeVisible();
});
