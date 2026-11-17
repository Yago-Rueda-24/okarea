import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../dominio/entities/user.entity';
import { UserRole } from '../../dominio/enums/user-role.enum';

@Injectable()
export class TypeOrmUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async createAndSave(userData: Partial<User>): Promise<User> {
    const user = this.repo.create(userData);
    return this.repo.save(user);
  }

  async findByEmail(email: string, includePassword = false): Promise<User | null> {
    const normalized = email.toLowerCase().trim();
    if (includePassword) {
      return this.repo
        .createQueryBuilder('user')
        .addSelect('user.passwordHash')
        .where('user.email = :email', { email: normalized })
        .getOne();
    }
    return this.repo.findOne({ where: { email: normalized } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByIdWithStats(id: string): Promise<User | null> {
    return this.repo.findOne({
      where: { id },
      relations: {
        prendas: true,
        outfits: true,
      },
    });
  }

  async findAllClients(): Promise<User[]> {
    return this.repo.find({
      where: { role: UserRole.USER },
      order: { createdAt: 'DESC' },
    });
  }

  async save(user: User): Promise<User> {
    return this.repo.save(user);
  }
}
