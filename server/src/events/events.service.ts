import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { S3Service } from '../common/s3.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly s3Service: S3Service,
  ) {}

  async findAll(search?: string): Promise<Event[]> {
    const where: any = {};
    if (search) {
      where.titulo = ILike(`%${search}%`);
    }
    return this.eventRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) {
      throw new NotFoundException(`Evento con ID '${id}' no encontrado.`);
    }
    return event;
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(event);
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    Object.assign(event, updateEventDto);
    return this.eventRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
  }

  async uploadPhoto(file: Express.Multer.File): Promise<{ url: string }> {
    const { url } = await this.s3Service.uploadFile(file, 'events');
    return { url };
  }
}
