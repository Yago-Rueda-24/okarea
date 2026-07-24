import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestingApp } from '../test-utils';

describe('Security & ApiKeyGuard Integration Tests', () => {
  let app: INestApplication;
  const validApiKey = 'okarea_secret_admin_key_2026';

  beforeAll(async () => {
    const testApp = await createTestingApp();
    app = testApp.app;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('debería permitir peticiones GET públicas sin API key', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/v1/products')
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/v1/categories')
      .expect(200);
  });

  it('debería rechazar peticiones POST protegidas con 401 si no se envía clave', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/categories')
      .send({ name: 'Prueba', slug: 'prueba' })
      .expect(401);

    expect(res.body.message).toContain('Acceso no autorizado');
  });

  it('debería rechazar peticiones si la API key enviada es incorrecta', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/categories')
      .set('x-api-key', 'clave_invalida_123')
      .send({ name: 'Prueba', slug: 'prueba' })
      .expect(401);
  });

  it('debería aceptar la API key mediante la cabecera x-api-key', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/categories')
      .set('x-api-key', validApiKey)
      .send({ name: 'Accesorios', slug: 'accesorios' })
      .expect(201);
  });

  it('debería aceptar la API key mediante la cabecera Authorization Bearer', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${validApiKey}`)
      .send({ name: 'Calzado Deportivo', slug: 'calzado-deportivo' })
      .expect(201);
  });
});
