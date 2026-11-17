import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/dominio/entities/user.entity';

export enum TipoPrenda {
  SUPERIOR = 'superior',
  INFERIOR = 'inferior',
  CALZADO = 'calzado',
  ABRIGO = 'abrigo',
  ACCESORIO = 'accesorio',
  OTRO = 'otro',
}

@Entity('armario_prendas')
export class Prenda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.prendas, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  nombre: string;

  @Column({ type: 'varchar', default: TipoPrenda.SUPERIOR })
  tipoPrenda: TipoPrenda;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  temporada: string;

  @Column({ nullable: true })
  estilo: string;

  @Column()
  fotoUrl: string;

  @Column()
  s3Key: string;

  @Column({ type: 'jsonb', nullable: true, default: () => "'{}'" })
  notasAdicionales: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

