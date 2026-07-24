import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { PhotosService } from './photos.service';

@Controller('products/:productId/photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findByProduct(@Param('productId') productId: string) {
    return this.photosService.findByProduct(productId);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('isMain') isMain?: string,
  ) {
    return this.photosService.uploadPhoto(productId, file, isMain === 'true');
  }

  @Patch(':photoId/main')
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  setMainPhoto(
    @Param('productId') productId: string,
    @Param('photoId') photoId: string,
  ) {
    return this.photosService.setMainPhoto(productId, photoId);
  }

  @Delete(':photoId')
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  deletePhoto(
    @Param('productId') productId: string,
    @Param('photoId') photoId: string,
  ) {
    return this.photosService.deletePhoto(productId, photoId);
  }
}
