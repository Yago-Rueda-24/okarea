import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Outfit } from './entities/outfit.entity';
import { OutfitItem } from './entities/outfit-item.entity';
import { OutfitRecommendedProduct } from './entities/outfit-recommended-product.entity';
import { Prenda } from '../prendas/dominio/entities/prenda.entity';
import { Product } from '../../blog/products/entities/product.entity';
import { CreateOutfitDto } from './dto/create-outfit.dto';

@Injectable()
export class OutfitsService {
  constructor(
    @InjectRepository(Outfit)
    private readonly outfitRepository: Repository<Outfit>,
    @InjectRepository(OutfitItem)
    private readonly outfitItemRepository: Repository<OutfitItem>,
    @InjectRepository(OutfitRecommendedProduct)
    private readonly outfitRecRepository: Repository<OutfitRecommendedProduct>,
    @InjectRepository(Prenda)
    private readonly prendaRepository: Repository<Prenda>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    userId: string,
    dto: CreateOutfitDto,
    creadorId?: string,
    esPropuestaEstilista = false,
    notaEstilista?: string,
  ): Promise<Outfit> {
    const outfit = this.outfitRepository.create({
      user: { id: userId } as any,
      creador: creadorId ? ({ id: creadorId } as any) : ({ id: userId } as any),
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      ocasion: dto.ocasion,
      temporada: dto.temporada,
      esPropuestaEstilista,
      notaEstilista,
    });

    const savedOutfit = await this.outfitRepository.save(outfit);

    // Guardar items de prendas
    if (dto.items && dto.items.length > 0) {
      const itemsToSave = dto.items.map((item) =>
        this.outfitItemRepository.create({
          outfit: savedOutfit,
          prenda: { id: item.prendaId } as Prenda,
          posicion: item.posicion || undefined,
        }),
      );
      await this.outfitItemRepository.save(itemsToSave);
    }

    // Guardar productos recomendados del catálogo Okarea
    if (dto.productosRecomendados && dto.productosRecomendados.length > 0) {
      const recsToSave = dto.productosRecomendados.map((rec) =>
        this.outfitRecRepository.create({
          outfit: savedOutfit,
          product: { id: rec.productId } as Product,
          comentario: rec.comentario || undefined,
        }),
      );
      await this.outfitRecRepository.save(recsToSave);
    }

    return this.findOne(savedOutfit.id);
  }

  async findAllByUser(userId: string): Promise<Outfit[]> {
    return this.outfitRepository.find({
      where: { user: { id: userId } },
      relations: {
        items: { prenda: true },
        productosRecomendados: { product: { photos: true } },
        creador: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId?: string): Promise<Outfit> {
    const query = this.outfitRepository
      .createQueryBuilder('outfit')
      .leftJoinAndSelect('outfit.user', 'user')
      .leftJoinAndSelect('outfit.creador', 'creador')
      .leftJoinAndSelect('outfit.items', 'items')
      .leftJoinAndSelect('items.prenda', 'prenda')
      .leftJoinAndSelect('outfit.productosRecomendados', 'recs')
      .leftJoinAndSelect('recs.product', 'product')
      .leftJoinAndSelect('product.photos', 'productPhotos')
      .where('outfit.id = :id', { id });

    if (userId) {
      query.andWhere('outfit.user.id = :userId', { userId });
    }

    const outfit = await query.getOne();
    if (!outfit) {
      throw new NotFoundException(`Outfit con ID '${id}' no encontrado.`);
    }

    return outfit;
  }

  async remove(id: string, userId: string): Promise<void> {
    const outfit = await this.findOne(id, userId);
    await this.outfitRepository.remove(outfit);
  }
}
