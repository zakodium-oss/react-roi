import { test, expect } from '@playwright/experimental-ct-react';

import { TestComponent } from '../TestComponent';

test('load initial rois', async ({ mount }) => {
  const component = await mount(<TestComponent />);
  const box1 = component.locator('_react=Box[id="box-1"]');
  const box2 = component.locator('_react=Box[id="box-2"]');
  // box 1
  await expect(box1).toHaveText('box1');
  await expect(box1).toHaveCSS('top', '0px');
  await expect(box1).toHaveCSS('left', '0px');
  await expect(box1).toHaveCSS('height', '250px');
  await expect(box1).toHaveCSS('width', '250px');
  // box 2
  await expect(box2).toHaveText('box2');
  await expect(box2).toHaveCSS('top', '350px');
  await expect(box2).toHaveCSS('left', '350px');
  await expect(box2).toHaveCSS('height', '150px');
  await expect(box2).toHaveCSS('width', '150px');
});
