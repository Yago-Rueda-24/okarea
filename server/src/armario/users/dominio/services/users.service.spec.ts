import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmUserRepository } from '../../infraestructura/persistencia/typeorm-user.repository';
import { BcryptPasswordHasherService } from '../../infraestructura/hashers/bcrypt-password-hasher.service';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<TypeOrmUserRepository>;
  let passwordHasher: { hash: jest.Mock; compare: jest.Mock };

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    passwordHash: 'hashed_password_123',
    nombre: 'Elena de Valmont',
    role: UserRole.USER,
    prendas: [],
    outfits: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserRepository = {
      createAndSave: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByIdWithStats: jest.fn(),
      findAllClients: jest.fn(),
      save: jest.fn(),
    };

    passwordHasher = {
      hash: jest.fn().mockResolvedValue('hashed_password_123'),
      compare: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: TypeOrmUserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: BcryptPasswordHasherService,
          useValue: passwordHasher,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(TypeOrmUserRepository);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un usuario con la contraseña hasheada y sin preferencias de estilo', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.createAndSave.mockResolvedValue({ ...mockUser });

      const result = await service.create({
        email: 'test@example.com',
        password: 'secretPassword123',
        nombre: 'Elena de Valmont',
      });

      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(passwordHasher.hash).toHaveBeenCalledWith('secretPassword123');
      expect(userRepository.createAndSave).toHaveBeenCalledWith({
        email: 'test@example.com',
        passwordHash: 'hashed_password_123',
        nombre: 'Elena de Valmont',
        role: UserRole.USER,
      });
      expect(result.passwordHash).toBeUndefined();
      expect(result.email).toBe('test@example.com');
      expect((result as any).preferenciasEstilo).toBeUndefined();
    });

    it('debe lanzar UserAlreadyExistsException si el email ya está registrado', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.create({
          email: 'test@example.com',
          password: 'anotherPassword',
          nombre: 'Otra Elena',
        }),
      ).rejects.toThrow(UserAlreadyExistsException);

      expect(passwordHasher.hash).not.toHaveBeenCalled();
      expect(userRepository.createAndSave).not.toHaveBeenCalled();
    });
  });

  describe('findByIdWithStats', () => {
    it('debe retornar el usuario con estadísticas si existe', async () => {
      const userWithStats = { ...mockUser, prendasCount: 5, outfitsCount: 2 };
      userRepository.findByIdWithStats.mockResolvedValue(userWithStats as any);

      const result = await service.findByIdWithStats(mockUser.id);
      expect(result).toEqual(userWithStats);
      expect(userRepository.findByIdWithStats).toHaveBeenCalledWith(mockUser.id);
    });

    it('debe lanzar UserNotFoundException si el usuario no existe', async () => {
      userRepository.findByIdWithStats.mockResolvedValue(null);

      await expect(service.findByIdWithStats('non-existent-id')).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('debe actualizar el nombre del usuario', async () => {
      userRepository.findById.mockResolvedValue({ ...mockUser });
      userRepository.save.mockResolvedValue({ ...mockUser, nombre: 'Elena Actualizada' });

      const result = await service.updateProfile(mockUser.id, { nombre: 'Elena Actualizada' });
      expect(result.nombre).toBe('Elena Actualizada');
      expect(userRepository.save).toHaveBeenCalled();
    });
  });
});
