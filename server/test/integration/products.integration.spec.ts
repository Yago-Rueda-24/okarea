import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestingApp } from '../test-utils';
import { CategoryType } from '../../src/products/enums/category.enum';

describe('Products Integration Tests', () => {
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

  it('debería retornar un listado vacío de productos inicialmente', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/products')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('debería rechazar la creación de producto sin x-api-key', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/products')
      .send({
        nombre: 'Zapatillas Running',
        categoria: CategoryType.CALZADO,
        precio: '79.99 €',
      })
      .expect(401);
  });

  it('debería rechazar payload inválido por ValidationPipe (falta nombre)', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/products')
      .set('x-api-key', adminApiKey)
      .send({
        descripcion: 'Sin campos requeridos',
      })
      .expect(400);
  });

  it('debería crear un producto exitosamente con x-api-key y DTO válido', async () => {
    const newProduct = {
      nombre: 'Camiseta Algodón Orgánico',
      descripcion: 'Camiseta de alta calidad',
      categoria: CategoryType.ROPA,
      precio: '25.00 €',
      tienda: 'Okarea Store',
    };

    const res = await request(app.getHttpServer())
      .post('/api/v1/products')
      .set('x-api-key', adminApiKey)
      .send(newProduct)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.nombre).toBe(newProduct.nombre);
    expect(res.body.categoria).toBe(CategoryType.ROPA);
    expect(res.body.precio).toBe('25.00 €');
  });

  it('debería filtrar productos por categoría y por parámetro de búsqueda', async () => {
    // Crear producto adicional de calzado
    await request(app.getHttpServer())
      .post('/api/v1/products')
      .set('x-api-key', adminApiKey)
      .send({
        nombre: 'Botas de Montaña Terrex',
        categoria: CategoryType.CALZADO,
        precio: '120.00 €',
      })
      .expect(201);

    // Filtrar por categoría calzado
    const resCalzado = await request(app.getHttpServer())
      .get(`/api/v1/products?categoria=${CategoryType.CALZADO}`)
      .expect(200);

    expect(resCalzado.body.length).toBe(1);
    expect(resCalzado.body[0].nombre).toBe('Botas de Montaña Terrex');

    // Filtrar por término de búsqueda "Algodón"
    const resSearch = await request(app.getHttpServer())
      .get('/api/v1/products?search=Algodón')
      .expect(200);

    expect(resSearch.body.length).toBe(1);
    expect(resSearch.body[0].nombre).toContain('Camiseta Algodón');
  });

  it('debería actualizar un producto existente', async () => {
    // Obtener primer producto
    const listRes = await request(app.getHttpServer()).get('/api/v1/products');
    const prodId = listRes.body[0].id;

    const updateRes = await request(app.getHttpServer())
      .put(`/api/v1/products/${prodId}`)
      .set('x-api-key', adminApiKey)
      .send({
        nombre: 'Camiseta Algodón Premium',
        precio: '29.99 €',
      })
      .expect(200);

    expect(updateRes.body.nombre).toBe('Camiseta Algodón Premium');
    expect(updateRes.body.precio).toBe('29.99 €');
  });

  it('debería eliminar un producto con x-api-key', async () => {
    const listRes = await request(app.getHttpServer()).get('/api/v1/products');
    const prodId = listRes.body[0].id;

    await request(app.getHttpServer())
      .delete(`/api/v1/products/${prodId}`)
      .set('x-api-key', adminApiKey)
      .expect(200);

    const getRes = await request(app.getHttpServer()).get(`/api/v1/products/${prodId}`);
    expect(getRes.status).toBe(404);
  });
});
