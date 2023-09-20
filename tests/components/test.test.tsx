import { test, expect } from '@playwright/experimental-ct-react';

import { TestComponent } from '../TestComponent';

test('load initial rois', async ({ mount }) => {
  const component = await mount(<TestComponent />);
  const box1 = component.locator('_react=Box[id="box-1"]');
  const box2 = component.locator('_react=Box[id="box-2"]');
  expect(await box1.innerText()).toStrictEqual('box1');
  expect(await box2.innerText()).toStrictEqual('box2');
  expect(await box1.boundingBox()).toStrictEqual({
    height: 250,
    width: 640,
    x: 0,
    y: 0,
  });
  expect(await box2.boundingBox()).toStrictEqual({
    height: 150,
    width: 384,
    x: 896,
    y: 350,
  });
});
