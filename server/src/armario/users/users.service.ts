import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: {
    email: string;
    password: string;
    nombre: string;
    role?: UserRole;
    preferenciasEstilo?: Record<string, any>;
  }): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { email: data.email.toLowerCase() } });
    if (existing) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const user = this.userRepository.create({
      email: data.email.toLowerCase(),
      passwordHash,
      nombre: data.nombre,
      role: data.role || UserRole.USER,
      preferenciasEstilo: data.preferenciasEstilo || {},
    });

    const saved = await this.userRepository.save(user);
    const { passwordHash: _, ...result } = saved;
    return result as User;
  }

  async findByEmail(email: string, includePassword = false): Promise<User | null> {
    if (includePassword) {
      return this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.passwordHash')
        .where('user.email = :email', { email: email.toLowerCase() })
        .getOne();
    }
    return this.userRepository.findOne({ where: { email: email.toLowerCase() } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAllClients(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: UserRole.USER },
      relations: {
        prendas: true,
        outfits: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async updatePreferences(id: string, preferences: Record<string, any>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    user.preferenciasEstilo = {
      ...user.preferenciasEstilo,
      ...preferences,
    };
    return this.userRepository.save(user);
  }
}
