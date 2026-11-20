import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outfit } from './dominio/entities/outfit.entity';
import { OutfitItem } from './dominio/entities/outfit-item.entity';
import { OutfitRecommendedProduct } from './dominio/entities/outfit-recommended-product.entity';
import { OutfitsService } from './dominio/services/outfits.service';
import { OutfitsController } from './controller/outfits.controller';
import { TypeOrmOutfitRepository } from './infraestructura/persistencia/typeorm-outfit.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Outfit,
      OutfitItem,
      OutfitRecommendedProduct,
    ]),
  ],
  controllers: [OutfitsController],
  providers: [TypeOrmOutfitRepository, OutfitsService],
  exports: [OutfitsService, TypeOrmOutfitRepository, TypeOrmModule],
})
export class OutfitsModule {}
