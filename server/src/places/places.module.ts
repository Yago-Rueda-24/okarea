import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { S3Service } from '../common/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Place])],
  controllers: [PlacesController],
  providers: [PlacesService, S3Service],
  exports: [PlacesService],
})
export class PlacesModule {}
