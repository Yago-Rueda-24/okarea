import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Prenda } from '../../../prendas/entities/prenda.entity';
import { Outfit } from '../../../outfits/entities/outfit.entity';
import { UserRole } from '../enums/user-role.enum';

@Entity('armario_users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column()
  nombre: string;

  @Column({ type: 'varchar', default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Prenda, (prenda) => prenda.user)
  prendas: Prenda[];

  @OneToMany(() => Outfit, (outfit) => outfit.user)
  outfits: Outfit[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
