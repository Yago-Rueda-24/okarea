import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('visits')
export class Visit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  path: string | null;

  @Column({ type: 'varchar', nullable: true })
  ipHash: string | null;

  @Column({ type: 'text', nullable: true })
  userAgent: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
