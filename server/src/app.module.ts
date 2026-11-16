import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { BlogModule, BLOG_ENTITIES } from './blog/blog.module';
import { ArmarioModule, ARMARIO_ENTITIES } from './armario/armario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env.dev', '../.env.prod', '.env'],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL', 60000),
          limit: configService.get<number>('THROTTLE_LIMIT', 100),
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'okarea_dev'),
        password: configService.get<string>('DB_PASSWORD', 'okarea_dev_pass'),
        database: configService.get<string>('DB_NAME', 'okarea_dev_db'),
        entities: [...BLOG_ENTITIES, ...ARMARIO_ENTITIES],
        synchronize: true, // Sincroniza esquema automáticamente en desarrollo
      }),
    }),
    HealthModule,
    BlogModule,
    ArmarioModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
