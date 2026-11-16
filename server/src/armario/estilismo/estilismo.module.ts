import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PrendasModule } from '../prendas/prendas.module';
import { OutfitsModule } from '../outfits/outfits.module';
import { EstilismoService } from './estilismo.service';
import { EstilismoController } from './estilismo.controller';
import { AdminOrStylistGuard } from '../auth/guards/admin-or-stylist.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StylingRequest } from './entities/styling-request.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([StylingRequest]),
    UsersModule,
    PrendasModule,
    OutfitsModule,
    JwtModule,
    ConfigModule,
  ],
  controllers: [EstilismoController],
  providers: [EstilismoService, AdminOrStylistGuard, JwtAuthGuard],
  exports: [EstilismoService],
})
export class EstilismoModule {}

