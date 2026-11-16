import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OutfitsService } from './outfits.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateOutfitDto } from './dto/create-outfit.dto';

@Controller('armario/outfits')
@UseGuards(JwtAuthGuard)
export class OutfitsController {
  constructor(private readonly outfitsService: OutfitsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateOutfitDto) {
    return this.outfitsService.create(user.id, dto, user.id, false);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.outfitsService.findAllByUser(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.outfitsService.findOne(id, user.id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.outfitsService.remove(id, user.id);
  }
}

