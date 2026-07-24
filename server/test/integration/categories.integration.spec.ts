import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestingApp } from '../test-utils';

describe('Categories Integration Tests', () => {
  let app: INestApplication;
  const adminApiKey = 'okarea_secret_admin_key_2026';

  beforeAll(async () => {
    const testApp = await createTestingApp();
    app = testApp.app;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('debería listar categorías inicialmente', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/categories')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debería crear una nueva categoría con x-api-key', async () => {
    const newCategory = {
      name: 'Sudaderas & Chaquetas',
      slug: 'sudaderas-chaquetas',
      description: 'Preciosas sudaderas para invierno',
    };

    const res = await request(app.getHttpServer())
      .post('/api/v1/categories')
      .set('x-api-key', adminApiKey)
      .send(newCategory)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(newCategory.name);
    expect(res.body.slug).toBe(newCategory.slug);
  });

  it('debería obtener una categoría por ID', async () => {
    const listRes = await request(app.getHttpServer()).get('/api/v1/categories');
    const category = listRes.body[0];

    const res = await request(app.getHttpServer())
      .get(`/api/v1/categories/${category.id}`)
      .expect(200);

    expect(res.body.id).toBe(category.id);
    expect(res.body.name).toBe(category.name);
  });

  it('debería actualizar una categoría', async () => {
    const listRes = await request(app.getHttpServer()).get('/api/v1/categories');
    const categoryId = listRes.body[0].id;

    const res = await request(app.getHttpServer())
      .put(`/api/v1/categories/${categoryId}`)
      .set('x-api-key', adminApiKey)
      .send({
        name: 'Sudaderas Urbanas',
        description: 'Edición limitada',
      })
      .expect(200);

    expect(res.body.name).toBe('Sudaderas Urbanas');
    expect(res.body.description).toBe('Edición limitada');
  });

  it('debería eliminar la categoría creada', async () => {
    const listRes = await request(app.getHttpServer()).get('/api/v1/categories');
    const categoryId = listRes.body[0].id;

    await request(app.getHttpServer())
      .delete(`/api/v1/categories/${categoryId}`)
      .set('x-api-key', adminApiKey)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/v1/categories/${categoryId}`)
      .expect(404);
  });
});
