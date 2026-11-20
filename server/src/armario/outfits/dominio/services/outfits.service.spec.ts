import { Test, TestingModule } from '@nestjs/testing';
import { OutfitsService } from './outfits.service';
import { TypeOrmOutfitRepository } from '../../infraestructura/persistencia/typeorm-outfit.repository';
import { OutfitNotFoundException } from '../exceptions/outfit-not-found.exception';
import { Outfit } from '../entities/outfit.entity';
import { CreateOutfitDto } from '../../controller/dto/create-outfit.dto';

describe('OutfitsService', () => {
  let service: OutfitsService;
  let repoMock: jest.Mocked<TypeOrmOutfitRepository>;

  const mockOutfit: Outfit = {
    id: 'outfit-1',
    user: { id: 'user-1' } as any,
    creador: { id: 'user-1' } as any,
    nombre: 'Look Ejecutivo',
    descripcion: 'Look para reuniones',
    ocasion: 'Trabajo',
    temporada: 'Otoño/Invierno',
    esPropuestaEstilista: false,
    notaEstilista: '',
    items: [],
    productosRecomendados: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    repoMock = {
      createAndSave: jest.fn(),
      findAllByUser: jest.fn(),
      findById: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutfitsService,
        {
          provide: TypeOrmOutfitRepository,
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<OutfitsService>(OutfitsService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe delegar la creación y guardado en el repositorio', async () => {
      const dto: CreateOutfitDto = {
        nombre: 'Look Ejecutivo',
        items: [{ prendaId: 'prenda-1', posicion: 'superior' }],
      };
      repoMock.createAndSave.mockResolvedValue(mockOutfit);

      const result = await service.create('user-1', dto);

      expect(repoMock.createAndSave).toHaveBeenCalledWith(
        'user-1',
        dto,
        undefined,
        false,
        undefined,
      );
      expect(result).toEqual(mockOutfit);
    });
  });

  describe('findAllByUser', () => {
    it('debe retornar todos los outfits del usuario', async () => {
      repoMock.findAllByUser.mockResolvedValue([mockOutfit]);

      const result = await service.findAllByUser('user-1');

      expect(repoMock.findAllByUser).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockOutfit]);
    });
  });

  describe('findOne', () => {
    it('debe retornar el outfit si existe', async () => {
      repoMock.findById.mockResolvedValue(mockOutfit);

      const result = await service.findOne('outfit-1', 'user-1');

      expect(repoMock.findById).toHaveBeenCalledWith('outfit-1', 'user-1');
      expect(result).toEqual(mockOutfit);
    });

    it('debe lanzar OutfitNotFoundException si el outfit no existe', async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.findOne('outfit-non-existent', 'user-1')).rejects.toThrow(
        OutfitNotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debe eliminar el outfit si existe', async () => {
      repoMock.findById.mockResolvedValue(mockOutfit);
      repoMock.remove.mockResolvedValue(undefined);

      await service.remove('outfit-1', 'user-1');

      expect(repoMock.findById).toHaveBeenCalledWith('outfit-1', 'user-1');
      expect(repoMock.remove).toHaveBeenCalledWith(mockOutfit);
    });

    it('debe lanzar excepción al intentar eliminar un outfit que no existe', async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.remove('outfit-non-existent', 'user-1')).rejects.toThrow(
        OutfitNotFoundException,
      );
      expect(repoMock.remove).not.toHaveBeenCalled();
    });
  });
});
