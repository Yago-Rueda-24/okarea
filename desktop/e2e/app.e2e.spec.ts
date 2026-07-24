import { test, expect, _electron as electron, ElectronApplication, Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Desktop Electron Application - Smoke & UI Specs', () => {
  let app: ElectronApplication;
  let window: Page;

  test.beforeAll(async () => {
    app = await electron.launch({
      args: [path.join(__dirname, '../dist-electron/main.js')],
    });
    window = await app.firstWindow();
    await window.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  test('debería iniciar la ventana principal de Electron correctamente', async () => {
    expect(window).not.toBeNull();
    const isVisible = await window.isVisible('header');
    expect(isVisible).toBe(true);
  });

  test('debería mostrar el título y badge de administración en el Header', async () => {
    const brand = window.getByText('OKAREA').first();
    await expect(brand).toBeVisible();

    const badge = window.getByText(/PANEL ADMIN DESKTOP/i).first();
    await expect(badge).toBeVisible();
  });

  test('debería renderizar la barra de búsqueda y el botón de crear producto', async () => {
    const searchInput = window.getByPlaceholder('Buscar productos...');
    await expect(searchInput).toBeVisible();

    const createBtn = window.getByRole('button', { name: /Nuevo Artículo/i }).first();
    await expect(createBtn).toBeVisible();
  });

  test('debería renderizar todas las pestañas de categorías', async () => {
    const categories = ['Todos', 'Bolsos', 'Calzado', 'Ropa', 'Accesorios'];
    for (const cat of categories) {
      const catBtn = window.getByRole('button', { name: new RegExp(cat, 'i') }).first();
      await expect(catBtn).toBeVisible();
    }
  });

  test('debería permitir escribir en la barra de búsqueda', async () => {
    const searchInput = window.getByPlaceholder('Buscar productos...');
    await searchInput.fill('Bolso Cuero');
    expect(await searchInput.inputValue()).toBe('Bolso Cuero');
    await searchInput.clear();
  });
});
