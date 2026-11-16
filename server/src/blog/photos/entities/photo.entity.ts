import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  filename: string;

  @Column({ nullable: true })
  s3Key: string;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({ default: false })
  isMain: boolean;

  @ManyToOne(() => Product, (product) => product.photos, { onDelete: 'CASCADE' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}
