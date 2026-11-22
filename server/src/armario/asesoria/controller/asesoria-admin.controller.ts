import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminOrStylistGuard } from '../../auth/guards/admin-or-stylist.guard';
import { AsesoriaService } from '../dominio/services/asesoria.service';
import { EstadoAsesoria } from '../dominio/enums/estado-asesoria.enum';

@Controller('armario/asesoria/admin')
@UseGuards(AdminOrStylistGuard)
export class AsesoriaAdminController {
  constructor(private readonly asesoriaService: AsesoriaService) {}

  @Get('solicitudes')
  obtenerTodasLasSolicitudes() {
    return this.asesoriaService.obtenerTodasLasAsesorias();
  }

  @Get('solicitudes/:id')
  obtenerDetalleSolicitud(@Param('id') id: string) {
    return this.asesoriaService.obtenerAsesoriaPorId(id);
  }

  @Get('solicitudes/:id/armario')
  async obtenerArmarioSolicitante(@Param('id') id: string) {
    const asesoria = await this.asesoriaService.obtenerAsesoriaPorId(id);
    return this.asesoriaService.obtenerArmarioDeUsuario(asesoria.user?.id);
  }

  @Get('usuarios/:userId/armario')
  obtenerArmarioDeUsuario(@Param('userId') userId: string) {
    return this.asesoriaService.obtenerArmarioDeUsuario(userId);
  }

  @Patch('solicitudes/:id/estado')
  actualizarEstado(
    @Param('id') id: string,
    @Body('estado') estado: EstadoAsesoria,
  ) {
    return this.asesoriaService.actualizarEstadoAdmin(id, estado);
  }
}
