import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Prenda, TipoPrenda } from './entities/prenda.entity';
import { CreatePrendaDto } from './dto/create-prenda.dto';
import { UpdatePrendaDto } from './dto/update-prenda.dto';
import { S3Service } from '../../common/s3.service';

@Injectable()
export class PrendasService {
  constructor(
    @InjectRepository(Prenda)
    private readonly prendaRepository: Repository<Prenda>,
    private readonly s3Service: S3Service,
  ) {}

  async create(userId: string, file: Express.Multer.File, dto: CreatePrendaDto): Promise<Prenda> {
    if (!file) {
      throw new BadRequestException('Debes adjuntar una foto de la prenda.');
    }

    const { s3Key, url } = await this.s3Service.uploadFile(file, `armario/${userId}`);

    let parsedNotas = {};
    if (typeof dto.notasAdicionales === 'string') {
      try {
        parsedNotas = JSON.parse(dto.notasAdicionales);
      } catch (e) {
        parsedNotas = { texto: dto.notasAdicionales };
      }
    } else if (dto.notasAdicionales) {
      parsedNotas = dto.notasAdicionales;
    }

    const prenda = this.prendaRepository.create({
      user: { id: userId } as any,
      nombre: dto.nombre,
      tipoPrenda: dto.tipoPrenda,
      color: dto.color,
      temporada: dto.temporada,
      estilo: dto.estilo,
      fotoUrl: url,
      s3Key,
      notasAdicionales: parsedNotas,
    });

    return this.prendaRepository.save(prenda);
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

    return this.prendaRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId?: string): Promise<Prenda> {
    const where: FindOptionsWhere<Prenda> = { id };
    if (userId) {
      where.user = { id: userId };
    }

    const prenda = await this.prendaRepository.findOne({ where });
    if (!prenda) {
      throw new NotFoundException(`Prenda con ID '${id}' no encontrada.`);
    }
    return prenda;
  }

  async update(id: string, userId: string, dto: UpdatePrendaDto): Promise<Prenda> {
    const prenda = await this.findOne(id, userId);

    if (dto.nombre !== undefined) prenda.nombre = dto.nombre;
    if (dto.tipoPrenda !== undefined) prenda.tipoPrenda = dto.tipoPrenda;
    if (dto.color !== undefined) prenda.color = dto.color;
    if (dto.temporada !== undefined) prenda.temporada = dto.temporada;
    if (dto.estilo !== undefined) prenda.estilo = dto.estilo;

    if (dto.notasAdicionales !== undefined) {
      let parsed = dto.notasAdicionales;
      if (typeof dto.notasAdicionales === 'string') {
        try {
          parsed = JSON.parse(dto.notasAdicionales);
        } catch (e) {
          parsed = { texto: dto.notasAdicionales };
        }
      }
      prenda.notasAdicionales = { ...prenda.notasAdicionales, ...parsed };
    }

    return this.prendaRepository.save(prenda);
  }

  async remove(id: string, userId: string): Promise<void> {
    const prenda = await this.findOne(id, userId);

    if (prenda.s3Key) {
      try {
        await this.s3Service.deleteFile(prenda.s3Key);
      } catch (err) {
        // Silently continue if S3 file was already deleted
      }
    }

    await this.prendaRepository.remove(prenda);
  }
}

