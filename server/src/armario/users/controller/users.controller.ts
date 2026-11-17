import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../dominio/services/users.service';
import { User } from '../dominio/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminOrStylistGuard } from '../../auth/guards/admin-or-stylist.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.findByIdWithStats(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get()
  @UseGuards(AdminOrStylistGuard)
  async findAllClients() {
    return this.usersService.findAllClients();
  }

  @Get(':id')
  @UseGuards(AdminOrStylistGuard)
  async findOne(@Param('id') id: string) {
    return this.usersService.findByIdWithStats(id);
  }
}
