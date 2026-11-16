import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prenda } from './entities/prenda.entity';
import { PrendasService } from './prendas.service';
import { PrendasController } from './prendas.controller';
import { S3Service } from '../../common/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prenda])],
  controllers: [PrendasController],
  providers: [PrendasService, S3Service],
  exports: [PrendasService],
})
export class PrendasModule {}

