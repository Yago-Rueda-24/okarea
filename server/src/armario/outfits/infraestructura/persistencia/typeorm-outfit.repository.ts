import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Outfit } from '../../dominio/entities/outfit.entity';
import { OutfitItem } from '../../dominio/entities/outfit-item.entity';
import { OutfitRecommendedProduct } from '../../dominio/entities/outfit-recommended-product.entity';
import { Prenda } from '../../../prendas/dominio/entities/prenda.entity';
import { Product } from '../../../../blog/products/entities/product.entity';
import { CreateOutfitDto } from '../../controller/dto/create-outfit.dto';

@Injectable()
export class TypeOrmOutfitRepository {
  constructor(
    @InjectRepository(Outfit)
    private readonly outfitRepo: Repository<Outfit>,
    @InjectRepository(OutfitItem)
    private readonly outfitItemRepo: Repository<OutfitItem>,
    @InjectRepository(OutfitRecommendedProduct)
    private readonly outfitRecRepo: Repository<OutfitRecommendedProduct>,
  ) {}

  async createAndSave(
    userId: string,
    dto: CreateOutfitDto,
    creadorId?: string,
    esPropuestaEstilista = false,
    notaEstilista?: string,
  ): Promise<Outfit> {
    const outfit = this.outfitRepo.create({
      user: { id: userId } as any,
      creador: creadorId ? ({ id: creadorId } as any) : ({ id: userId } as any),
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      ocasion: dto.ocasion,
      temporada: dto.temporada,
      esPropuestaEstilista,
      notaEstilista,
    });

    const savedOutfit = await this.outfitRepo.save(outfit);

    if (dto.items && dto.items.length > 0) {
      const itemsToSave = dto.items.map((item) =>
        this.outfitItemRepo.create({
          outfit: savedOutfit,
          prenda: { id: item.prendaId } as Prenda,
          posicion: item.posicion || undefined,
        }),
      );
      await this.outfitItemRepo.save(itemsToSave);
    }

    if (dto.productosRecomendados && dto.productosRecomendados.length > 0) {
      const recsToSave = dto.productosRecomendados.map((rec) =>
        this.outfitRecRepo.create({
          outfit: savedOutfit,
          product: { id: rec.productId } as Product,
          comentario: rec.comentario || undefined,
        }),
      );
      await this.outfitRecRepo.save(recsToSave);
    }

    return (await this.findById(savedOutfit.id)) as Outfit;
  }

  async findAllByUser(userId: string): Promise<Outfit[]> {
    return this.outfitRepo.find({
      where: { user: { id: userId } },
      relations: {
        items: { prenda: true },
        productosRecomendados: { product: { photos: true } },
        creador: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, userId?: string): Promise<Outfit | null> {
    const query = this.outfitRepo
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

    return query.getOne();
  }

  async remove(outfit: Outfit): Promise<void> {
    await this.outfitRepo.remove(outfit);
  }
}
