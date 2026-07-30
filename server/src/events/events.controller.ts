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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @Throttle({ default: { limit: 150, ttl: 60000 } })
  findAll(@Query('search') search?: string) {
    return this.eventsService.findAll(search);
  }

  @Get(':id')
  @Throttle({ default: { limit: 150, ttl: 60000 } })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post('upload')
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    return this.eventsService.uploadPhoto(file);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Put(':id')
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  partialUpdate(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
