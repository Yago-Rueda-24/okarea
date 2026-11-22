import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asesoria } from '../../dominio/entities/asesoria.entity';
import { EstadoAsesoria } from '../../dominio/enums/estado-asesoria.enum';
import { User } from '../../../users/dominio/entities/user.entity';

@Injectable()
export class TypeOrmAsesoriaRepository {
  constructor(
    @InjectRepository(Asesoria)
    private readonly asesoriaRepo: Repository<Asesoria>,
  ) {}

  async findByFechaYHora(fecha: string, horaInicio: string): Promise<Asesoria | null> {
    return this.asesoriaRepo.findOne({
      where: {
        fecha,
        horaInicio,
      },
      relations: { user: true },
    });
  }

  async findByFecha(fecha: string): Promise<Asesoria[]> {
    return this.asesoriaRepo.find({
      where: { fecha },
      order: { horaInicio: 'ASC' },
    });
  }

  async findByUser(userId: string): Promise<Asesoria[]> {
    return this.asesoriaRepo.find({
      where: { user: { id: userId } },
      order: { fecha: 'ASC', horaInicio: 'ASC' },
    });
  }

  async findById(id: string): Promise<Asesoria | null> {
    return this.asesoriaRepo.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async createAndSave(
    userId: string,
    data: { fecha: string; horaInicio: string; horaFin: string; motivo: string },
  ): Promise<Asesoria> {
    const asesoria = this.asesoriaRepo.create({
      user: { id: userId } as User,
      fecha: data.fecha,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      motivo: data.motivo,
      estado: EstadoAsesoria.CONFIRMADA,
    });
    return this.asesoriaRepo.save(asesoria);
  }

  async save(asesoria: Asesoria): Promise<Asesoria> {
    return this.asesoriaRepo.save(asesoria);
  }
}
