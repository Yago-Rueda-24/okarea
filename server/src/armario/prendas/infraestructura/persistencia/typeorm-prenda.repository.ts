import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Prenda } from '../../dominio/entities/prenda.entity';
import { TipoPrenda } from '../../dominio/enums/tipo-prenda.enum';

@Injectable()
export class TypeOrmPrendaRepository {
  constructor(
    @InjectRepository(Prenda)
    private readonly repo: Repository<Prenda>,
  ) {}

  async createAndSave(data: Partial<Prenda>): Promise<Prenda> {
    const prenda = this.repo.create(data);
    return this.repo.save(prenda);
  }

  async findAllByUser(
    userId: string,
    filters?: { tipoPrenda?: TipoPrenda; temporada?: string; estilo?: string },
  ): Promise<Prenda[]> {
    const where: FindOptionsWhere<Prenda> = {
      user: { id: userId },
    };

    if (filters?.tipoPrenda) {
      where.tipoPrenda = filters.tipoPrenda;
    }
    if (filters?.temporada) {
      where.temporada = filters.temporada;
    }
    if (filters?.estilo) {
      where.estilo = filters.estilo;
    }

    return this.repo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, userId?: string): Promise<Prenda | null> {
    const where: FindOptionsWhere<Prenda> = { id };
    if (userId) {
      where.user = { id: userId };
    }
    return this.repo.findOne({ where });
  }

  async save(prenda: Prenda): Promise<Prenda> {
    return this.repo.save(prenda);
  }

  async remove(prenda: Prenda): Promise<void> {
    await this.repo.remove(prenda);
  }
}
