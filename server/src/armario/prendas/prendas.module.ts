import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prenda } from './dominio/entities/prenda.entity';
import { PrendasService } from './dominio/services/prendas.service';
import { PrendasController } from './controller/prendas.controller';
import { TypeOrmPrendaRepository } from './infraestructura/persistencia/typeorm-prenda.repository';
import { S3Service } from '../../common/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prenda])],
  controllers: [PrendasController],
  providers: [TypeOrmPrendaRepository, PrendasService, S3Service],
  exports: [PrendasService, TypeOrmPrendaRepository, TypeOrmModule],
})
export class PrendasModule {}
