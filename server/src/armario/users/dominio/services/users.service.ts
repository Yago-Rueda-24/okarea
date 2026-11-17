import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { TypeOrmUserRepository } from '../../infraestructura/persistencia/typeorm-user.repository';
import { BcryptPasswordHasherService } from '../../infraestructura/hashers/bcrypt-password-hasher.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: TypeOrmUserRepository,
    private readonly passwordHasher: BcryptPasswordHasherService,
  ) {}

  async create(data: {
    email: string;
    password: string;
    nombre: string;
    role?: UserRole;
  }): Promise<User> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new UserAlreadyExistsException(data.email);
    }

    const passwordHash = await this.passwordHasher.hash(data.password);

    const user = await this.userRepository.createAndSave({
      email: data.email.toLowerCase().trim(),
      passwordHash,
      nombre: data.nombre.trim(),
      role: data.role || UserRole.USER,
    });

    const { passwordHash: _, ...result } = user;
    return result as User;
  }

  async findByEmail(email: string, includePassword = false): Promise<User | null> {
    return this.userRepository.findByEmail(email, includePassword);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  async findByIdWithStats(id: string) {
    const user = await this.userRepository.findByIdWithStats(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  async updateProfile(id: string, updateData: { nombre?: string }): Promise<User> {
    const user = await this.findByIdOrThrow(id);
    if (updateData.nombre !== undefined) {
      user.nombre = updateData.nombre.trim();
    }
    const updated = await this.userRepository.save(user);
    const { passwordHash: _, ...result } = updated;
    return result as User;
  }

  async findAllClients(): Promise<User[]> {
    return this.userRepository.findAllClients();
  }
}
