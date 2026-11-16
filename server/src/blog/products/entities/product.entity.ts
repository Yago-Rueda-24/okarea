import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Photo } from '../../photos/entities/photo.entity';
import { CategoryType } from '../enums/category.enum';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'simple-enum', enum: CategoryType, default: CategoryType.BOLSOS })
  categoria: CategoryType;

  @Column({ nullable: true })
  fabricante: string;

  @Column({ nullable: true })
  tienda: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  temporada: string;

  @Column({ nullable: true })
  precio: string;

  @Column({ nullable: true })
  enlaceSitio: string;

  @Column({ nullable: true })
  imagenUrl: string;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL', nullable: true })
  category?: Category | null;

  @OneToMany(() => Photo, (photo) => photo.product, { cascade: true })
  photos: Photo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
