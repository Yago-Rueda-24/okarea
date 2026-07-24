import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestingApp } from '../test-utils';
import { CategoryType } from '../../src/products/enums/category.enum';

describe('Server End-to-End (E2E) API Flow', () => {
  let app: INestApplication;
  const apiKey = 'okarea_secret_admin_key_2026';

  let categoryId: string;
  let productId: string;
  let photoId: string;

  beforeAll(async () => {
    const testApp = await createTestingApp();
    app = testApp.app;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('1. GET /api/v1/health debe responder 200 OK con estado del servidor', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200);

    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('Okarea Catalog API');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('2. POST /api/v1/categories debe crear una nueva categoría', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/categories')
      .set('x-api-key', apiKey)
      .send({
        name: 'Colección Verano',
        slug: 'coleccion-verano',
        description: 'Ropa ligera y fresca para la temporada',
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    categoryId = res.body.id;
  });

  it('3. POST /api/v1/products debe crear un nuevo producto', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/products')
      .set('x-api-key', apiKey)
      .send({
        nombre: 'Gafas de Sol Polarizadas',
        descripcion: 'Protección UV400 con montura ultra ligera',
        categoria: CategoryType.ACCESORIOS,
        precio: '45.99 €',
        tienda: 'Okarea Main Store',
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    productId = res.body.id;
  });

  it('4. POST /api/v1/products/:id/photos debe adjuntar una fotografía', async () => {
    const buffer = Buffer.from('fake-image-content-data');

    const res = await request(app.getHttpServer())
      .post(`/api/v1/products/${productId}/photos?isMain=true`)
      .set('x-api-key', apiKey)
      .attach('file', buffer, 'gafas.jpg')
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.isMain).toBe(true);
    expect(res.body.url).toContain('okarea-catalog');
    photoId = res.body.id;
  });

  it('5. GET /api/v1/products/:id debe incluir la lista de fotos adjuntas', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/products/${productId}`)
      .expect(200);

    expect(res.body.id).toBe(productId);
    expect(res.body.photos).toBeDefined();
    expect(res.body.photos.length).toBe(1);
    expect(res.body.photos[0].id).toBe(photoId);
  });

  it('6. DELETE /api/v1/products/:id/photos/:photoId debe eliminar la foto', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/products/${productId}/photos/${photoId}`)
      .set('x-api-key', apiKey)
      .expect(200);

    const getRes = await request(app.getHttpServer())
      .get(`/api/v1/products/${productId}`)
      .expect(200);

    expect(getRes.body.photos.length).toBe(0);
  });

  it('7. DELETE /api/v1/products/:id debe eliminar el producto', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/products/${productId}`)
      .set('x-api-key', apiKey)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/v1/products/${productId}`)
      .expect(404);
  });

  it('8. DELETE /api/v1/categories/:id debe eliminar la categoría', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/categories/${categoryId}`)
      .set('x-api-key', apiKey)
      .expect(200);
  });
});
