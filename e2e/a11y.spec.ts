import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('La página de accesibilidad no tiene violaciones WCAG AA evidentes', async ({ page }) => {
  await page.goto('/accessibility');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
