import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Outfit } from './outfit.entity';
import { Product } from '../../../blog/products/entities/product.entity';

@Entity('armario_outfit_recommended_products')
export class OutfitRecommendedProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Outfit, (outfit) => outfit.productosRecomendados, { onDelete: 'CASCADE' })
  outfit: Outfit;

  @ManyToOne(() => Product, { onDelete: 'CASCADE', eager: true })
  product: Product;

  @Column({ type: 'text', nullable: true })
  comentario?: string;
}
