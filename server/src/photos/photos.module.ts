import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { Product } from '../products/entities/product.entity';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { S3Service } from '../common/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, Product])],
  controllers: [PhotosController],
  providers: [PhotosService, S3Service],
  exports: [PhotosService],
})
export class PhotosModule {}
