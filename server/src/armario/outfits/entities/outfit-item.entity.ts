import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Outfit } from './outfit.entity';
import { Prenda } from '../../prendas/entities/prenda.entity';

@Entity('armario_outfit_items')
export class OutfitItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Outfit, (outfit) => outfit.items, { onDelete: 'CASCADE' })
  outfit: Outfit;

  @ManyToOne(() => Prenda, { onDelete: 'CASCADE', eager: true })
  prenda: Prenda;

  @Column({ nullable: true })
  posicion?: string;
}
