import { test, expect } from '@playwright/test';

test('demo', async ({ page }) => {
  await page.goto('http://localhost:5173/index.html');
  expect(await page.title()).toContain('React ROI Demo');
});
