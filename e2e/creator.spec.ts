import { test, expect } from '@playwright/test';

const CUBO = { name: 'Cubo', exact: true };

test('El editor 3D carga y permite añadir un cubo', async ({ page }) => {
  await page.goto('/creator');

  // El canvas de Three.js debe estar presente
  const canvas = page.locator('canvas');
  await expect(canvas).toHaveCount(1);

  // Añadir un cubo
  await page.getByTitle('Añadir Cubo').click();

  // Debe aparecer el objeto en la jerarquía (botón de jerarquía con nombre Cubo)
  await expect(page.getByRole('button', CUBO)).toBeVisible();
});

test('Se puede eliminar un objeto seleccionado', async ({ page }) => {
  await page.goto('/creator');
  await page.getByTitle('Añadir Cubo').click();
  await page.getByRole('button', CUBO).click(); // seleccionar
  await page.getByTitle('Eliminar').click();
  await expect(page.getByRole('button', CUBO)).not.toBeVisible();
});

test('Deshacer y rehacer funcionan', async ({ page }) => {
  await page.goto('/creator');
  await page.getByTitle('Añadir Cubo').click();
  await page.getByTitle('Deshacer').click();
  await expect(page.getByRole('button', CUBO)).not.toBeVisible();
  await page.getByTitle('Rehacer').click();
  await expect(page.getByRole('button', CUBO)).toBeVisible();
});
