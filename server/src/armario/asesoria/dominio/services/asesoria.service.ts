import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TypeOrmAsesoriaRepository } from '../../infraestructura/persistencia/typeorm-asesoria.repository';
import { CreateAsesoriaDto } from '../../controller/dto/create-asesoria.dto';
import { Asesoria } from '../entities/asesoria.entity';
import { EstadoAsesoria } from '../enums/estado-asesoria.enum';
import { PrendasService } from '../../../prendas/dominio/services/prendas.service';
import { Prenda } from '../../../prendas/dominio/entities/prenda.entity';

export interface FranjaDisponibilidad {
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

@Injectable()
export class AsesoriaService {
  public static readonly FRANJAS_LABORALES = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ];

  constructor(
    private readonly asesoriaRepo: TypeOrmAsesoriaRepository,
    private readonly prendasService: PrendasService,
  ) {}

  calcularHoraFin(horaInicio: string): string {
    const [h, m] = horaInicio.split(':').map(Number);
    const endH = (h + 1).toString().padStart(2, '0');
    const endM = (m || 0).toString().padStart(2, '0');
    return `${endH}:${endM}`;
  }

  async obtenerDisponibilidad(fecha: string): Promise<FranjaDisponibilidad[]> {
    const reservas = await this.asesoriaRepo.findByFecha(fecha);
    const ocupadas = new Set(
      reservas
        .filter((r) => r.estado !== EstadoAsesoria.CANCELADA)
        .map((r) => r.horaInicio),
    );

    return AsesoriaService.FRANJAS_LABORALES.map((horaInicio) => ({
      horaInicio,
      horaFin: this.calcularHoraFin(horaInicio),
      disponible: !ocupadas.has(horaInicio),
    }));
  }

  async crearAsesoria(
    userId: string,
    dto: CreateAsesoriaDto,
  ): Promise<Asesoria> {
    const existente = await this.asesoriaRepo.findByFechaYHora(
      dto.fecha,
      dto.horaInicio,
    );

    if (existente && existente.estado !== EstadoAsesoria.CANCELADA) {
      throw new ConflictException(
        `La franja horaria de ${dto.horaInicio} a ${this.calcularHoraFin(
          dto.horaInicio,
        )} para el día ${dto.fecha} ya ha sido reservada. Por favor, seleccione otra hora.`,
      );
    }

    const horaFin = this.calcularHoraFin(dto.horaInicio);
    return this.asesoriaRepo.createAndSave(userId, {
      fecha: dto.fecha,
      horaInicio: dto.horaInicio,
      horaFin,
      motivo: dto.motivo,
    });
  }

  async obtenerMisAsesorias(userId: string): Promise<Asesoria[]> {
    return this.asesoriaRepo.findByUser(userId);
  }

  async cancelarAsesoria(id: string, userId: string): Promise<Asesoria> {
    const asesoria = await this.asesoriaRepo.findById(id);
    if (!asesoria || asesoria.user?.id !== userId) {
      throw new NotFoundException('Asesoría no encontrada');
    }
    asesoria.estado = EstadoAsesoria.CANCELADA;
    return this.asesoriaRepo.save(asesoria);
  }

  async obtenerTodasLasAsesorias(): Promise<Asesoria[]> {
    return this.asesoriaRepo.findAll();
  }

  async obtenerAsesoriaPorId(id: string): Promise<Asesoria> {
    const asesoria = await this.asesoriaRepo.findById(id);
    if (!asesoria) {
      throw new NotFoundException('Asesoría no encontrada');
    }
    return asesoria;
  }

  async obtenerArmarioDeUsuario(userId: string): Promise<Prenda[]> {
    if (!userId) {
      return [];
    }
    return this.prendasService.findAllByUser(userId);
  }

  async actualizarEstadoAdmin(
    id: string,
    estado: EstadoAsesoria,
  ): Promise<Asesoria> {
    const asesoria = await this.obtenerAsesoriaPorId(id);
    asesoria.estado = estado;
    return this.asesoriaRepo.save(asesoria);
  }
}
