import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/dominio/entities/user.entity';
import { PrendasModule } from './prendas/prendas.module';
import { OutfitsModule } from './outfits/outfits.module';
import { AsesoriaModule } from './asesoria/asesoria.module';

import { Prenda } from './prendas/dominio/entities/prenda.entity';
import { Outfit } from './outfits/dominio/entities/outfit.entity';
import { OutfitItem } from './outfits/dominio/entities/outfit-item.entity';
import { OutfitRecommendedProduct } from './outfits/dominio/entities/outfit-recommended-product.entity';
import { Asesoria } from './asesoria/dominio/entities/asesoria.entity';

export const ARMARIO_ENTITIES = [
  User,
  Prenda,
  Outfit,
  OutfitItem,
  OutfitRecommendedProduct,
  Asesoria,
];

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrendasModule,
    OutfitsModule,
    AsesoriaModule,
  ],
  exports: [
    AuthModule,
    UsersModule,
    PrendasModule,
    OutfitsModule,
    AsesoriaModule,
  ],
})
export class ArmarioModule {}
