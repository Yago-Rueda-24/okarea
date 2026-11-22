import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AsesoriaService } from './asesoria.service';
import { TypeOrmAsesoriaRepository } from '../../infraestructura/persistencia/typeorm-asesoria.repository';
import { EstadoAsesoria } from '../enums/estado-asesoria.enum';
import { Asesoria } from '../entities/asesoria.entity';
import { User } from '../../../users/dominio/entities/user.entity';

describe('AsesoriaService', () => {
  let service: AsesoriaService;
  let repository: jest.Mocked<TypeOrmAsesoriaRepository>;

  const mockUser: User = {
    id: 'user-uuid-1',
    email: 'test@example.com',
    nombre: 'Test User',
  } as User;

  const mockAsesoria: Asesoria = {
    id: 'asesoria-uuid-1',
    user: mockUser,
    fecha: '2026-12-01',
    horaInicio: '10:00',
    horaFin: '11:00',
    motivo: 'Asesoría para renovación de temporada de invierno',
    estado: EstadoAsesoria.CONFIRMADA,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepo = {
      findByFechaYHora: jest.fn(),
      findByFecha: jest.fn(),
      findByUser: jest.fn(),
      findById: jest.fn(),
      createAndSave: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AsesoriaService,
        {
          provide: TypeOrmAsesoriaRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<AsesoriaService>(AsesoriaService);
    repository = module.get(TypeOrmAsesoriaRepository);
  });

  describe('calcularHoraFin', () => {
    it('debe calcular correctamente la franja de 1 hora', () => {
      expect(service.calcularHoraFin('10:00')).toBe('11:00');
      expect(service.calcularHoraFin('09:00')).toBe('10:00');
      expect(service.calcularHoraFin('16:30')).toBe('17:30');
    });
  });

  describe('obtenerDisponibilidad', () => {
    it('debe devolver todas las franjas disponibles si no hay citas registradas ese día', async () => {
      repository.findByFecha.mockResolvedValue([]);

      const result = await service.obtenerDisponibilidad('2026-12-01');

      expect(result.length).toBe(AsesoriaService.FRANJAS_LABORALES.length);
      expect(result.every((slot) => slot.disponible)).toBe(true);
      expect(result.find((slot) => slot.horaInicio === '10:00')?.horaFin).toBe(
        '11:00',
      );
    });

    it('debe marcar como no disponible la franja que ya esté reservada', async () => {
      repository.findByFecha.mockResolvedValue([mockAsesoria]);

      const result = await service.obtenerDisponibilidad('2026-12-01');

      const slot10 = result.find((slot) => slot.horaInicio === '10:00');
      const slot11 = result.find((slot) => slot.horaInicio === '11:00');

      expect(slot10?.disponible).toBe(false);
      expect(slot11?.disponible).toBe(true);
    });

    it('debe mantener disponible una franja si la cita existente fue cancelada', async () => {
      repository.findByFecha.mockResolvedValue([
        { ...mockAsesoria, estado: EstadoAsesoria.CANCELADA },
      ]);

      const result = await service.obtenerDisponibilidad('2026-12-01');

      const slot10 = result.find((slot) => slot.horaInicio === '10:00');
      expect(slot10?.disponible).toBe(true);
    });
  });

  describe('crearAsesoria', () => {
    it('debe reservar con éxito una franja libre de 1 hora', async () => {
      repository.findByFechaYHora.mockResolvedValue(null);
      repository.createAndSave.mockResolvedValue(mockAsesoria);

      const dto = {
        fecha: '2026-12-01',
        horaInicio: '10:00',
        motivo: 'Asesoría para renovación de temporada de invierno',
      };

      const result = await service.crearAsesoria(mockUser.id, dto);

      expect(repository.findByFechaYHora).toHaveBeenCalledWith(
        '2026-12-01',
        '10:00',
      );
      expect(repository.createAndSave).toHaveBeenCalledWith(mockUser.id, {
        fecha: '2026-12-01',
        horaInicio: '10:00',
        horaFin: '11:00',
        motivo: dto.motivo,
      });
      expect(result).toEqual(mockAsesoria);
    });

    it('debe lanzar ConflictException si la franja ya está reservada', async () => {
      repository.findByFechaYHora.mockResolvedValue(mockAsesoria);

      const dto = {
        fecha: '2026-12-01',
        horaInicio: '10:00',
        motivo: 'Intento de duplicar cita',
      };

      await expect(service.crearAsesoria(mockUser.id, dto)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.createAndSave).not.toHaveBeenCalled();
    });

    it('debe permitir reservar si la cita previa en esa hora estaba cancelada', async () => {
      repository.findByFechaYHora.mockResolvedValue({
        ...mockAsesoria,
        estado: EstadoAsesoria.CANCELADA,
      });
      repository.createAndSave.mockResolvedValue(mockAsesoria);

      const dto = {
        fecha: '2026-12-01',
        horaInicio: '10:00',
        motivo: 'Nueva cita en franja liberada',
      };

      const result = await service.crearAsesoria(mockUser.id, dto);
      expect(result).toEqual(mockAsesoria);
      expect(repository.createAndSave).toHaveBeenCalled();
    });
  });

  describe('obtenerMisAsesorias', () => {
    it('debe listar las asesorías del usuario', async () => {
      repository.findByUser.mockResolvedValue([mockAsesoria]);

      const result = await service.obtenerMisAsesorias(mockUser.id);

      expect(repository.findByUser).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual([mockAsesoria]);
    });
  });

  describe('cancelarAsesoria', () => {
    it('debe cancelar la asesoría si pertenece al usuario', async () => {
      repository.findById.mockResolvedValue({ ...mockAsesoria });
      repository.save.mockImplementation(async (entity) => entity);

      const result = await service.cancelarAsesoria(
        mockAsesoria.id,
        mockUser.id,
      );

      expect(result.estado).toBe(EstadoAsesoria.CANCELADA);
      expect(repository.save).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si no existe o no es del usuario', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.cancelarAsesoria('inexistente', mockUser.id),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
