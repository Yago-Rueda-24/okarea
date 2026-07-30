import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { S3Service } from '../common/s3.service';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private readonly s3Service: S3Service,
  ) {}

  async findAll(search?: string): Promise<Place[]> {
    const where: any = {};
    if (search) {
      where.nombre = ILike(`%${search}%`);
    }
    return this.placeRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Place> {
    const place = await this.placeRepository.findOneBy({ id });
    if (!place) {
      throw new NotFoundException(`Lugar con ID '${id}' no encontrado.`);
    }
    return place;
  }

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    const place = this.placeRepository.create(createPlaceDto);
    return this.placeRepository.save(place);
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    const place = await this.findOne(id);
    Object.assign(place, updatePlaceDto);
    return this.placeRepository.save(place);
  }

  async remove(id: string): Promise<void> {
    const place = await this.findOne(id);
    await this.placeRepository.remove(place);
  }

  async uploadPhoto(file: Express.Multer.File): Promise<{ url: string }> {
    const { url } = await this.s3Service.uploadFile(file, 'places');
    return { url };
  }
}
