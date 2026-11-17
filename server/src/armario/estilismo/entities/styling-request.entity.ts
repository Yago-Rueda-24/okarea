import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/dominio/entities/user.entity';

export enum StylingRequestStatus {
  PENDING = 'pendiente',
  IN_PROGRESS = 'en_curso',
  COMPLETED = 'completada',
}

@Entity('armario_styling_requests')
export class StylingRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  occasion: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'varchar', default: StylingRequestStatus.PENDING })
  status: StylingRequestStatus;

  @CreateDateColumn()
  createdAt: Date;
}
