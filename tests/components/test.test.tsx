import { expect, test } from '@playwright/experimental-ct-react';

import { TestComponent } from '../TestComponent.tsx';

// eslint-disable-next-line @typescript-eslint/unbound-method
test('load initial rois', async ({ mount, page }) => {
  await mount(<TestComponent />);
  const label1 = page.getByTestId('label-box-1');
  const label2 = page.getByTestId('label-box-2');
  const box1 = page.getByTestId('box-1');
  const box2 = page.getByTestId('box-2');
  // box 1
  await expect(label1).toHaveText('box1');
  await expect(box1).toHaveCSS('top', '0px');
  await expect(box1).toHaveCSS('left', '0px');
  await expect(box1).toHaveCSS('height', '250px');
  await expect(box1).toHaveCSS('width', '250px');
  // box 2
  await expect(label2).toHaveText('box2');
  await expect(box2).toHaveCSS('top', '350px');
  await expect(box2).toHaveCSS('left', '350px');
  await expect(box2).toHaveCSS('height', '150px');
  await expect(box2).toHaveCSS('width', '150px');
});
