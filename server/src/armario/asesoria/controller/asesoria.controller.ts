import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/dominio/entities/user.entity';
import { AsesoriaService } from '../dominio/services/asesoria.service';
import { CreateAsesoriaDto } from './dto/create-asesoria.dto';

@Controller('armario/asesoria')
@UseGuards(JwtAuthGuard)
export class AsesoriaController {
  constructor(private readonly asesoriaService: AsesoriaService) {}

  @Get('disponibilidad')
  obtenerDisponibilidad(@Query('fecha') fecha: string) {
    return this.asesoriaService.obtenerDisponibilidad(fecha);
  }

  @Post()
  crear(@CurrentUser() user: User, @Body() dto: CreateAsesoriaDto) {
    return this.asesoriaService.crearAsesoria(user.id, dto);
  }

  @Get('mis-asesorias')
  obtenerMisAsesorias(@CurrentUser() user: User) {
    return this.asesoriaService.obtenerMisAsesorias(user.id);
  }

  @Patch(':id/cancelar')
  cancelar(@CurrentUser() user: User, @Param('id') id: string) {
    return this.asesoriaService.cancelarAsesoria(id, user.id);
  }
}
