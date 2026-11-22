import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Asesoria } from './dominio/entities/asesoria.entity';
import { TypeOrmAsesoriaRepository } from './infraestructura/persistencia/typeorm-asesoria.repository';
import { AsesoriaService } from './dominio/services/asesoria.service';
import { AsesoriaController } from './controller/asesoria.controller';
import { AsesoriaAdminController } from './controller/asesoria-admin.controller';
import { PrendasModule } from '../prendas/prendas.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AdminOrStylistGuard } from '../auth/guards/admin-or-stylist.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asesoria]),
    ConfigModule,
    PrendasModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AsesoriaController, AsesoriaAdminController],
  providers: [TypeOrmAsesoriaRepository, AsesoriaService, AdminOrStylistGuard],
  exports: [AsesoriaService, TypeOrmAsesoriaRepository],
})
export class AsesoriaModule {}
