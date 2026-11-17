import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './dominio/entities/user.entity';
import { UsersController } from './controller/users.controller';
import { UsersService } from './dominio/services/users.service';
import { BcryptPasswordHasherService } from './infraestructura/hashers/bcrypt-password-hasher.service';
import { TypeOrmUserRepository } from './infraestructura/persistencia/typeorm-user.repository';
import { AdminOrStylistGuard } from '../auth/guards/admin-or-stylist.guard';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule,
  ],
  controllers: [UsersController],
  providers: [
    TypeOrmUserRepository,
    BcryptPasswordHasherService,
    UsersService,
    AdminOrStylistGuard,
  ],
  exports: [UsersService, TypeOrmUserRepository, TypeOrmModule],
})
export class UsersModule {}
