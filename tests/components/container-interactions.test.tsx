/* eslint-disable @typescript-eslint/unbound-method */
import { expect, test } from '@playwright/experimental-ct-react';
import type { Page } from '@playwright/test';

import { ContainerInteractionsTestComponent } from '../ContainerInteractionsTestComponent.tsx';

/**
 * The container stays hidden until its size and the target's size are known,
 * and ignores pointer events until then.
 */
async function waitForContainer(page: Page) {
  await expect(page.locator('#container')).toBeVisible();
}

async function dragOnEmptySpace(page: Page) {
  // Bottom-left area of the container is free of ROIs.
  await page.mouse.move(50, 450);
  await page.mouse.down();
  await page.mouse.move(100, 400, { steps: 5 });
  await page.mouse.move(150, 350, { steps: 5 });
  await page.mouse.up();
}

async function clickOnEmptySpace(page: Page) {
  await page.mouse.click(50, 450);
}

test.describe('pan', () => {
  test('dragging on empty space pans in select mode', async ({
    mount,
    page,
  }) => {
    await mount(<ContainerInteractionsTestComponent mode="select" />);
    await waitForContainer(page);
    const transform = page.getByTestId('transform');
    const before = await transform.textContent();
    await dragOnEmptySpace(page);
    await expect(transform).not.toHaveText(before as string);
  });

  test('dragging on empty space does nothing when pan is not allowed', async ({
    mount,
    page,
  }) => {
    await mount(
      <ContainerInteractionsTestComponent
        mode="select"
        interactions={{ pan: false }}
      />,
    );
    await waitForContainer(page);
    const transform = page.getByTestId('transform');
    const before = await transform.textContent();
    await dragOnEmptySpace(page);
    await expect(transform).toHaveText(before as string);
  });
});

test.describe('zoom', () => {
  test('mouse wheel zooms', async ({ mount, page }) => {
    await mount(<ContainerInteractionsTestComponent />);
    await waitForContainer(page);
    const transform = page.getByTestId('transform');
    const before = await transform.textContent();
    await page.mouse.move(250, 250);
    await page.mouse.wheel(0, -100);
    await expect(transform).not.toHaveText(before as string);
  });

  test('mouse wheel does nothing when zoom is not allowed', async ({
    mount,
    page,
  }) => {
    await mount(
      <ContainerInteractionsTestComponent interactions={{ zoom: false }} />,
    );
    await waitForContainer(page);
    const transform = page.getByTestId('transform');
    const before = await transform.textContent();
    await page.mouse.move(250, 250);
    await page.mouse.wheel(0, -100);
    // Wait long enough for the throttled zoom handler to have fired if it was going to.
    await page.waitForTimeout(100);
    await expect(transform).toHaveText(before as string);
  });
});

test.describe('unselect', () => {
  test('clicking on empty space unselects the current ROI', async ({
    mount,
    page,
  }) => {
    await mount(<ContainerInteractionsTestComponent selectedRoiId="box-1" />);
    await waitForContainer(page);
    const selected = page.getByTestId('selected');
    await expect(selected).toHaveText('box-1');
    await clickOnEmptySpace(page);
    await expect(selected).toHaveText('none');
  });

  test('clicking on empty space keeps the selection when unselect is not allowed', async ({
    mount,
    page,
  }) => {
    await mount(
      <ContainerInteractionsTestComponent
        selectedRoiId="box-1"
        interactions={{ unselect: false }}
      />,
    );
    await waitForContainer(page);
    const selected = page.getByTestId('selected');
    await expect(selected).toHaveText('box-1');
    await clickOnEmptySpace(page);
    await expect(selected).toHaveText('box-1');
  });

  test('clicking on empty space in select mode keeps the selection when unselect is not allowed', async ({
    mount,
    page,
  }) => {
    await mount(
      <ContainerInteractionsTestComponent
        mode="select"
        selectedRoiId="box-1"
        interactions={{ unselect: false }}
      />,
    );
    await waitForContainer(page);
    const selected = page.getByTestId('selected');
    await clickOnEmptySpace(page);
    await expect(selected).toHaveText('box-1');
  });
});
