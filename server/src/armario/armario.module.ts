import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/dominio/entities/user.entity';
import { PrendasModule } from './prendas/prendas.module';
import { OutfitsModule } from './outfits/outfits.module';
import { EstilismoModule } from './estilismo/estilismo.module';

import { Prenda } from './prendas/entities/prenda.entity';
import { Outfit } from './outfits/entities/outfit.entity';
import { OutfitItem } from './outfits/entities/outfit-item.entity';
import { OutfitRecommendedProduct } from './outfits/entities/outfit-recommended-product.entity';
import { StylingRequest } from './estilismo/entities/styling-request.entity';

export const ARMARIO_ENTITIES = [
  User,
  Prenda,
  Outfit,
  OutfitItem,
  OutfitRecommendedProduct,
  StylingRequest,
];

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrendasModule,
    OutfitsModule,
    EstilismoModule,
  ],
  exports: [
    AuthModule,
    UsersModule,
    PrendasModule,
    OutfitsModule,
    EstilismoModule,
  ],
})
export class ArmarioModule {}

