import { Injectable } from '@nestjs/common';
import { Outfit } from '../entities/outfit.entity';
import { CreateOutfitDto } from '../../controller/dto/create-outfit.dto';
import { TypeOrmOutfitRepository } from '../../infraestructura/persistencia/typeorm-outfit.repository';
import { OutfitNotFoundException } from '../exceptions/outfit-not-found.exception';

@Injectable()
export class OutfitsService {
  constructor(private readonly outfitRepository: TypeOrmOutfitRepository) {}

  async create(
    userId: string,
    dto: CreateOutfitDto,
    creadorId?: string,
    esPropuestaEstilista = false,
    notaEstilista?: string,
  ): Promise<Outfit> {
    return this.outfitRepository.createAndSave(
      userId,
      dto,
      creadorId,
      esPropuestaEstilista,
      notaEstilista,
    );
  }

  async findAllByUser(userId: string): Promise<Outfit[]> {
    return this.outfitRepository.findAllByUser(userId);
  }

  async findOne(id: string, userId?: string): Promise<Outfit> {
    const outfit = await this.outfitRepository.findById(id, userId);
    if (!outfit) {
      throw new OutfitNotFoundException(id);
    }
    return outfit;
  }

  async remove(id: string, userId: string): Promise<void> {
    const outfit = await this.findOne(id, userId);
    await this.outfitRepository.remove(outfit);
  }
}
