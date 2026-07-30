import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { S3Service } from '../common/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventsController],
  providers: [EventsService, S3Service],
  exports: [EventsService],
})
export class EventsModule {}
