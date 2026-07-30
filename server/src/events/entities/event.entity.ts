import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  lugar: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  foto: string;

  @Column({ nullable: true })
  enlace: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
