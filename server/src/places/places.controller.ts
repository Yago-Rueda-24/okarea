import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  @Throttle({ default: { limit: 150, ttl: 60000 } })
  findAll(@Query('search') search?: string) {
    return this.placesService.findAll(search);
  }

  @Get(':id')
  @Throttle({ default: { limit: 150, ttl: 60000 } })
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @Post('upload')
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    return this.placesService.uploadPhoto(file);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.create(createPlaceDto);
  }

  @Put(':id')
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  partialUpdate(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  remove(@Param('id') id: string) {
    return this.placesService.remove(id);
  }
}
