import { test, expect } from '@playwright/test';

test('El visor 3D carga sin fallar', async ({ page }) => {
  await page.goto('/viewer');
  const canvas = page.locator('canvas');
  await expect(canvas).toHaveCount(1);
});
