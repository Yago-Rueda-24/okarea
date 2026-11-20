import { BadRequestException, Injectable } from '@nestjs/common';
import { Prenda } from '../entities/prenda.entity';
import { TipoPrenda } from '../enums/tipo-prenda.enum';
import { PrendaNotFoundException } from '../exceptions/prenda-not-found.exception';
import { CreatePrendaDto } from '../../controller/dto/create-prenda.dto';
import { UpdatePrendaDto } from '../../controller/dto/update-prenda.dto';
import { TypeOrmPrendaRepository } from '../../infraestructura/persistencia/typeorm-prenda.repository';
import { S3Service } from '../../../../common/s3.service';

@Injectable()
export class PrendasService {
  constructor(
    private readonly prendaRepository: TypeOrmPrendaRepository,
    private readonly s3Service: S3Service,
  ) {}

  async create(userId: string, file: Express.Multer.File, dto: CreatePrendaDto): Promise<Prenda> {
    let fotoUrl: string;
    let s3Key: string;

    if (file) {
      const uploadResult = await this.s3Service.uploadFile(file, `armario/${userId}`);
      fotoUrl = uploadResult.url;
      s3Key = uploadResult.s3Key;
    } else if (dto.fotoUrl) {
      fotoUrl = dto.fotoUrl;
      s3Key = `direct-${Date.now()}`;
    } else {
      throw new BadRequestException('Debes adjuntar una foto de la prenda.');
    }

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

    return this.prendaRepository.createAndSave({
      user: { id: userId } as any,
      nombre: dto.nombre,
      tipoPrenda: dto.tipoPrenda,
      color: dto.color,
      temporada: dto.temporada,
      estilo: dto.estilo,
      fotoUrl,
      s3Key,
      notasAdicionales: parsedNotas,
    });
  }

  async findAllByUser(
    userId: string,
    filters?: { tipoPrenda?: TipoPrenda; temporada?: string; estilo?: string },
  ): Promise<Prenda[]> {
    return this.prendaRepository.findAllByUser(userId, filters);
  }

  async findOne(id: string, userId?: string): Promise<Prenda> {
    const prenda = await this.prendaRepository.findById(id, userId);
    if (!prenda) {
      throw new PrendaNotFoundException(id);
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

    if (prenda.s3Key && !prenda.s3Key.startsWith('direct-')) {
      try {
        await this.s3Service.deleteFile(prenda.s3Key);
      } catch (err) {
        // Silently continue if S3 file was already deleted
      }
    }

    await this.prendaRepository.remove(prenda);
  }
}
