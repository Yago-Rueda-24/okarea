import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outfit } from './entities/outfit.entity';
import { OutfitItem } from './entities/outfit-item.entity';
import { OutfitRecommendedProduct } from './entities/outfit-recommended-product.entity';
import { Prenda } from '../prendas/entities/prenda.entity';
import { Product } from '../../blog/products/entities/product.entity';
import { OutfitsService } from './outfits.service';
import { OutfitsController } from './outfits.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Outfit,
      OutfitItem,
      OutfitRecommendedProduct,
      Prenda,
      Product,
    ]),
  ],
  controllers: [OutfitsController],
  providers: [OutfitsService],
  exports: [OutfitsService],
})
export class OutfitsModule {}

