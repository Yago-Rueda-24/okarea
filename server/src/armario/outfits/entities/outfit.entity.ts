import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/dominio/entities/user.entity';
import { OutfitItem } from './outfit-item.entity';
import { OutfitRecommendedProduct } from './outfit-recommended-product.entity';

@Entity('armario_outfits')
export class Outfit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.outfits, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  creador?: User | null;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  ocasion: string;

  @Column({ nullable: true })
  temporada: string;

  @Column({ type: 'boolean', default: false })
  esPropuestaEstilista: boolean;

  @Column({ type: 'text', nullable: true })
  notaEstilista: string;

  @OneToMany(() => OutfitItem, (item) => item.outfit, { cascade: true })
  items: OutfitItem[];

  @OneToMany(() => OutfitRecommendedProduct, (rec) => rec.outfit, { cascade: true })
  productosRecomendados: OutfitRecommendedProduct[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

