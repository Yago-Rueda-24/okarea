import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, CanActivate, ExecutionContext } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { Category } from '../src/categories/entities/category.entity';
import { Product } from '../src/products/entities/product.entity';
import { Photo } from '../src/photos/entities/photo.entity';
import { CategoriesModule } from '../src/categories/categories.module';
import { ProductsModule } from '../src/products/products.module';
import { PhotosModule } from '../src/photos/photos.module';
import { HealthModule } from '../src/health/health.module';
import { S3Service } from '../src/common/s3.service';

process.env.NODE_ENV = 'test';

export class MockS3Service {
  async onModuleInit() {}
  async uploadFile(file: Express.Multer.File, keyPrefix = 'photos') {
    const s3Key = `${keyPrefix}/test-${Date.now()}.png`;
    return {
      s3Key,
      url: `http://localhost:9000/okarea-catalog/${s3Key}`,
    };
  }
  async deleteFile(s3Key: string) {
    return Promise.resolve();
  }
}

export class MockThrottlerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

export async function createTestingApp(): Promise<{ app: INestApplication; moduleRef: TestingModule }> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [
          () => ({
            ADMIN_API_KEY: 'okarea_secret_admin_key_2026',
            SKIP_S3_INIT: 'true',
          }),
        ],
      }),
      TypeOrmModule.forRoot({
        type: 'better-sqlite3',
        database: ':memory:',
        entities: [Category, Product, Photo],
        synchronize: true,
        logging: false,
      }),
      CategoriesModule,
      ProductsModule,
      PhotosModule,
      HealthModule,
    ],
  })
    .overrideGuard(ThrottlerGuard)
    .useClass(MockThrottlerGuard)
    .overrideProvider(APP_GUARD)
    .useClass(MockThrottlerGuard)
    .overrideProvider(S3Service)
    .useClass(MockS3Service)
    .compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  return { app, moduleRef };
}
