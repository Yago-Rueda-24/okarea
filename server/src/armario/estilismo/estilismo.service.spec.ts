import { Test, TestingModule } from '@nestjs/testing';
import { EstilismoService } from './estilismo.service';
import { UsersService } from '../users/dominio/services/users.service';
import { PrendasService } from '../prendas/dominio/services/prendas.service';
import { OutfitsService } from '../outfits/outfits.service';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StylingRequest } from './entities/styling-request.entity';

describe('EstilismoService', () => {
  let service: EstilismoService;
  let usersServiceMock: any;
  let prendasServiceMock: any;
  let outfitsServiceMock: any;
  let requestRepoMock: any;

  beforeEach(async () => {
    usersServiceMock = {
      findAllClients: jest.fn(),
      findById: jest.fn(),
    };
    prendasServiceMock = {
      findAllByUser: jest.fn(),
    };
    outfitsServiceMock = {
      findAllByUser: jest.fn(),
      create: jest.fn(),
    };
    requestRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstilismoService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: PrendasService, useValue: prendasServiceMock },
        { provide: OutfitsService, useValue: outfitsServiceMock },
        { provide: getRepositoryToken(StylingRequest), useValue: requestRepoMock },
      ],
    }).compile();

    service = module.get<EstilismoService>(EstilismoService);
  });

  it('debe listar clientes con sus contadores de prendas y outfits', async () => {
    usersServiceMock.findAllClients.mockResolvedValue([
      {
        id: 'client-1',
        nombre: 'Ana López',
        email: 'ana@example.com',
        prendas: [{ id: 'p1' }, { id: 'p2' }],
        outfits: [{ id: 'o1' }],
        createdAt: new Date(),
      },
    ]);

    const result = await service.listClients();
    expect(result).toHaveLength(1);
    expect(result[0].totalPrendas).toBe(2);
    expect(result[0].totalOutfits).toBe(1);
  });

  it('debe lanzar NotFoundException si el cliente no existe al pedir su armario', async () => {
    usersServiceMock.findById.mockResolvedValue(null);
    await expect(service.getClientWardrobe('inexistente')).rejects.toThrow(NotFoundException);
  });

  it('debe permitir a un estilista recomendar un outfit para un cliente', async () => {
    usersServiceMock.findById.mockResolvedValue({ id: 'client-1', nombre: 'Ana' });
    outfitsServiceMock.create.mockResolvedValue({ id: 'outfit-1', esPropuestaEstilista: true });

    const result = await service.recommendOutfit('client-1', {
      nombre: 'Look sugerido para evento',
      notaEstilista: 'Combina tu blazer con este pantalón',
      items: [{ prendaId: 'prenda-1' }],
      productosRecomendados: [{ productId: 'prod-1' }],
    }, 'stylist-id-99');

    expect(outfitsServiceMock.create).toHaveBeenCalledWith(
      'client-1',
      expect.anything(),
      'stylist-id-99',
      true,
      'Combina tu blazer con este pantalón',
    );
    expect(result.id).toBe('outfit-1');
  });
});

