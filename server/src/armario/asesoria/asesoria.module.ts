import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asesoria } from './dominio/entities/asesoria.entity';
import { TypeOrmAsesoriaRepository } from './infraestructura/persistencia/typeorm-asesoria.repository';
import { AsesoriaService } from './dominio/services/asesoria.service';
import { AsesoriaController } from './controller/asesoria.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Asesoria])],
  controllers: [AsesoriaController],
  providers: [TypeOrmAsesoriaRepository, AsesoriaService],
  exports: [AsesoriaService, TypeOrmAsesoriaRepository],
})
export class AsesoriaModule {}
