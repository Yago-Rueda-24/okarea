import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../users/dominio/entities/user.entity';
import { EstadoAsesoria } from '../enums/estado-asesoria.enum';

@Entity('armario_asesorias')
export class Asesoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  fecha: string; // Formato YYYY-MM-DD

  @Column()
  horaInicio: string; // Formato HH:mm (ej. '10:00')

  @Column()
  horaFin: string; // Formato HH:mm (ej. '11:00')

  @Column({ type: 'text' })
  motivo: string;

  @Column({ type: 'varchar', default: EstadoAsesoria.CONFIRMADA })
  estado: EstadoAsesoria;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
