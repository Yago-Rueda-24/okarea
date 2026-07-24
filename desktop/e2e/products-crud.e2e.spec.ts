import { test, expect, _electron as electron, ElectronApplication, Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Desktop Electron Application - Product CRUD Modal Flows', () => {
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

  test('debería abrir el modal de creación, completar el formulario, probar vista previa y cerrar', async () => {
    // 1. Abrir Modal
    const createBtn = window.getByRole('button', { name: /Nuevo Artículo/i }).first();
    await createBtn.click();

    const modalTitle = window.getByText(/Insertar Nuevo Artículo/i).first();
    await expect(modalTitle).toBeVisible();

    // 2. Rellenar Campos del Formulario
    const nameInput = window.getByPlaceholder('Ej. Kenza Small Cow').first();
    await nameInput.fill('Bolso de Viaje Cuero Premium');

    const priceInput = window.getByPlaceholder('Ej. 115.00').first();
    await priceInput.fill('189.99');

    const storeInput = window.getByPlaceholder('Ej. Olivia Mareque').first();
    await storeInput.fill('Okarea Flagship');

    const descTextarea = window.locator('textarea').first();
    await descTextarea.fill('Bolso artesanal confeccionado en cuero vacuno 100% legítimo.');

    expect(await nameInput.inputValue()).toBe('Bolso de Viaje Cuero Premium');
    expect(await priceInput.inputValue()).toBe('189.99');

    // 3. Cambiar a Pestaña de Vista Previa
    const previewTabBtn = window.getByRole('button', { name: /Previsualización Web/i }).first();
    await previewTabBtn.click();

    const previewName = window.getByText('Bolso de Viaje Cuero Premium').first();
    await expect(previewName).toBeVisible();

    const previewPrice = window.getByText('189.99').first();
    await expect(previewPrice).toBeVisible();

    // 4. Cerrar el Modal
    const closeBtn = window.getByRole('button', { name: /Cancelar/i }).first();
    await closeBtn.click();

    await expect(modalTitle).not.toBeVisible();
  });
});
