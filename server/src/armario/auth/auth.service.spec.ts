import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMock: any;
  let jwtServiceMock: any;

  beforeEach(async () => {
    usersServiceMock = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };
    jwtServiceMock = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('debe registrar un nuevo usuario y devolver su token', async () => {
    const mockUser = {
      id: 'uuid-user-1',
      email: 'test@example.com',
      nombre: 'Usuario Prueba',
      role: UserRole.USER,
    };
    usersServiceMock.create.mockResolvedValue(mockUser);

    const result = await service.register({
      email: 'test@example.com',
      password: 'password123',
      nombre: 'Usuario Prueba',
    });

    expect(usersServiceMock.create).toHaveBeenCalled();
    expect(jwtServiceMock.sign).toHaveBeenCalled();
    expect(result.accessToken).toBe('mock-jwt-token');
    expect(result.user).toEqual(mockUser);
  });

  it('debe hacer login exitoso con credenciales correctas', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const mockUser = {
      id: 'uuid-user-1',
      email: 'test@example.com',
      passwordHash: hashedPassword,
      nombre: 'Usuario Prueba',
      role: UserRole.USER,
    };
    usersServiceMock.findByEmail.mockResolvedValue(mockUser);

    const result = await service.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.accessToken).toBe('mock-jwt-token');
    expect(result.user.email).toBe('test@example.com');
  });

  it('debe fallar login con contraseña incorrecta', async () => {
    const hashedPassword = await bcrypt.hash('correct_password', 10);
    usersServiceMock.findByEmail.mockResolvedValue({
      id: 'uuid-user-1',
      email: 'test@example.com',
      passwordHash: hashedPassword,
    });

    await expect(
      service.login({ email: 'test@example.com', password: 'wrong_password' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
