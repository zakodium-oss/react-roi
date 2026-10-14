/* eslint-disable @typescript-eslint/unbound-method */
import { expect, test } from '@playwright/experimental-ct-react';
import type { Locator, Page } from '@playwright/test';

import { RoiInteractionsTestComponent } from '../RoiInteractionsTestComponent.tsx';

const BOX_1_GEOMETRY = '100,100,100,100,0.000';

async function waitForContainer(page: Page) {
  await expect(page.locator('#container')).toBeVisible();
}

/**
 * Drag from the center of an element by the given offset.
 */
async function dragFrom(page: Page, locator: Locator, dx: number, dy: number) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('element has no bounding box');
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + dx, startY + dy, { steps: 5 });
  await page.mouse.up();
}

test.describe('select', () => {
  test('clicking a ROI selects it', async ({ mount, page }) => {
    await mount(<RoiInteractionsTestComponent />);
    await waitForContainer(page);
    await page.getByTestId('box-1').click();
    await expect(page.getByTestId('selected')).toHaveText('box-1');
  });

  test('a ROI which cannot be selected is not selected on click', async ({
    mount,
    page,
  }) => {
    await mount(
      <RoiInteractionsTestComponent
        interactions={{ 'box-1': { select: false } }}
      />,
    );
    await waitForContainer(page);
    await page.getByTestId('box-1').click();
    await expect(page.getByTestId('selected')).toHaveText('none');
  });

  test('A unselectable ROI cannot be moved', async ({ mount, page }) => {
    await mount(
      <RoiInteractionsTestComponent
        interactions={{ 'box-1': { select: false } }}
      />,
    );
    await waitForContainer(page);
    await expect(page.getByTestId('count')).toHaveText('2');
    // Dragging over box-1 in hybrid mode draws a new ROI instead of moving it.
    await dragFrom(page, page.getByTestId('box-1'), 40, 40);
    await expect(page.getByTestId('count')).toHaveText('3');
    await expect(page.getByTestId('geometry-box-1')).toHaveText(BOX_1_GEOMETRY);
  });

  test('a selected ROI is unselected when it becomes not selectable', async ({
    mount,
    page,
  }) => {
    await mount(
      <RoiInteractionsTestComponent
        selectedRoiId="box-1"
        interactions={{ 'box-1': { select: false } }}
      />,
    );
    await waitForContainer(page);
    await expect(page.getByTestId('selected')).toHaveText('none');
  });
});

test.describe('move', () => {
  test('dragging a ROI moves it', async ({ mount, page }) => {
    await mount(<RoiInteractionsTestComponent />);
    await waitForContainer(page);
    await dragFrom(page, page.getByTestId('box-1'), 40, 20);
    await expect(page.getByTestId('geometry-box-1')).toHaveText(
      '140,120,100,100,0.000',
    );
  });

  test('dragging a ROI which cannot be moved selects it but does not move it', async ({
    mount,
    page,
  }) => {
    await mount(
      <RoiInteractionsTestComponent
        interactions={{ 'box-1': { move: false } }}
      />,
    );
    await waitForContainer(page);
    await dragFrom(page, page.getByTestId('box-1'), 40, 20);
    await expect(page.getByTestId('selected')).toHaveText('box-1');
    await expect(page.getByTestId('geometry-box-1')).toHaveText(BOX_1_GEOMETRY);
    // The drag did not fall through to the container either.
    await expect(page.getByTestId('count')).toHaveText('2');
  });
});

test.describe('resize', () => {
  test('all handles are shown and resize the ROI by default', async ({
    mount,
    page,
  }) => {
    await mount(<RoiInteractionsTestComponent selectedRoiId="box-1" />);
    await waitForContainer(page);
    await expect(page.getByTestId(/^resize-handle-/)).toHaveCount(8);
    await dragFrom(
      page,
      page.getByTestId('resize-handle-bottom-right'),
      20,
      10,
    );
    await expect(page.getByTestId('geometry-box-1')).toHaveText(
      '100,100,120,110,0.000',
    );
  });

  test('handles are shown but do nothing when resize is not allowed', async ({
    mount,
    page,
  }) => {
    await mount(
      <RoiInteractionsTestComponent
        selectedRoiId="box-1"
        interactions={{ 'box-1': { resize: false } }}
        showGrid
      />,
    );
    await waitForContainer(page);
    await expect(page.getByTestId(/^resize-handle-/)).toHaveCount(8);
    await expect(page.getByTestId(/^resize-edge-/)).toHaveCount(4);
    await dragFrom(page, page.getByTestId('resize-handle-center-right'), 30, 0);
    await dragFrom(page, page.getByTestId('resize-edge-bottom'), 0, 25);
    // The drags fall through to the box and move it, but the size is unchanged.
    await expect(page.getByTestId('geometry-box-1')).toHaveText(
      '130,125,100,100,0.000',
    );
  });

  test('a side handle resizes the ROI', async ({ mount, page }) => {
    await mount(<RoiInteractionsTestComponent selectedRoiId="box-1" />);
    await waitForContainer(page);
    await dragFrom(page, page.getByTestId('resize-handle-center-right'), 30, 0);
    await expect(page.getByTestId('geometry-box-1')).toHaveText(
      '100,100,130,100,0.000',
    );
  });

  test('an edge resizes the ROI', async ({ mount, page }) => {
    await mount(
      <RoiInteractionsTestComponent selectedRoiId="box-1" showGrid />,
    );
    await waitForContainer(page);
    await dragFrom(page, page.getByTestId('resize-edge-bottom'), 0, 25);
    await expect(page.getByTestId('geometry-box-1')).toHaveText(
      '100,100,100,125,0.000',
    );
  });
});

test.describe('rotate', () => {
  test('the rotation handle is shown and rotates the ROI', async ({
    mount,
    page,
  }) => {
    await mount(
      <RoiInteractionsTestComponent selectedRoiId="box-1" showRotationHandle />,
    );
    await waitForContainer(page);
    const handle = page.getByTestId('rotate-handle');
    await expect(handle).toBeVisible();
    await dragFrom(page, handle, 60, 60);
    await expect(page.getByTestId('geometry-box-1')).not.toHaveText(
      BOX_1_GEOMETRY,
    );
  });

  test('the rotation handle is not shown when rotate is not allowed', async ({
    mount,
    page,
  }) => {
    await mount(
      <RoiInteractionsTestComponent
        selectedRoiId="box-1"
        showRotationHandle
        interactions={{ 'box-1': { rotate: false } }}
      />,
    );
    await waitForContainer(page);
    await expect(page.getByTestId('rotate-handle')).toHaveCount(0);
  });

  test('in rotate_selected mode, dragging rotates the selected ROI', async ({
    mount,
    page,
  }) => {
    await mount(
      <RoiInteractionsTestComponent
        mode="rotate_selected"
        selectedRoiId="box-1"
      />,
    );
    await waitForContainer(page);
    await dragFrom(page, page.getByTestId('box-2'), 100, 0);
    await expect(page.getByTestId('geometry-box-1')).not.toHaveText(
      BOX_1_GEOMETRY,
    );
  });

  test('in rotate_selected mode, dragging rotates the selected ROI even when rotate is false', async ({
    mount,
    page,
  }) => {
    await mount(
      <RoiInteractionsTestComponent
        mode="rotate_selected"
        selectedRoiId="box-1"
        interactions={{ 'box-1': { rotate: false } }}
      />,
    );
    await waitForContainer(page);
    await dragFrom(page, page.getByTestId('box-2'), 100, 0);
    await expect(page.getByTestId('geometry-box-1')).not.toHaveText(
      BOX_1_GEOMETRY,
    );
  });
});
