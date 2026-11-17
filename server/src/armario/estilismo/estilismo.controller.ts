import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { EstilismoService } from './estilismo.service';
import { AdminOrStylistGuard } from '../auth/guards/admin-or-stylist.guard';
import { RecomendarOutfitDto } from './dto/recomendar-outfit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/dominio/entities/user.entity';
import { CreateStylingRequestDto } from './dto/create-styling-request.dto';

@Controller('armario/estilismo')
@UseGuards(AdminOrStylistGuard)
export class EstilismoController {
  constructor(private readonly estilismoService: EstilismoService) {}

  @Post('solicitudes')
  @UseGuards(JwtAuthGuard)
  createRequest(@CurrentUser() user: User, @Body() dto: CreateStylingRequestDto) {
    return this.estilismoService.createRequest(user.id, dto);
  }

  @Get('solicitudes')
  @UseGuards(JwtAuthGuard)
  listRequests(@CurrentUser() user: User) {
    return this.estilismoService.listRequests(user.id);
  }

  @Get('clientes')
  listClients() {
    return this.estilismoService.listClients();
  }

  @Get('clientes/:id/armario')
  getClientWardrobe(@Param('id') clientId: string) {
    return this.estilismoService.getClientWardrobe(clientId);
  }

  @Get('clientes/:id/outfits')
  getClientOutfits(@Param('id') clientId: string) {
    return this.estilismoService.getClientOutfits(clientId);
  }

  @Post('clientes/:id/recomendar-outfit')
  recommendOutfit(
    @Param('id') clientId: string,
    @Body() dto: RecomendarOutfitDto,
    @Req() req: any,
  ) {
    const stylistId = req.user?.id;
    return this.estilismoService.recommendOutfit(clientId, dto, stylistId);
  }
}

