import { Test, TestingModule } from '@nestjs/testing';
import { PrendasService } from './prendas.service';
import { TipoPrenda } from '../enums/tipo-prenda.enum';
import { PrendaNotFoundException } from '../exceptions/prenda-not-found.exception';
import { TypeOrmPrendaRepository } from '../../infraestructura/persistencia/typeorm-prenda.repository';
import { S3Service } from '../../../../common/s3.service';
import { BadRequestException } from '@nestjs/common';

describe('PrendasService', () => {
  let service: PrendasService;
  let repoMock: any;
  let s3Mock: any;

  beforeEach(async () => {
    repoMock = {
      createAndSave: jest.fn((dto) => Promise.resolve({ id: 'prenda-1', ...dto })),
      save: jest.fn((entity) => Promise.resolve({ id: 'prenda-1', ...entity })),
      findAllByUser: jest.fn(),
      findById: jest.fn(),
      remove: jest.fn(),
    };
    s3Mock = {
      uploadFile: jest.fn().mockResolvedValue({
        s3Key: 'armario/user-1/prenda.jpg',
        url: 'http://localhost:9000/okarea-catalog/armario/user-1/prenda.jpg',
      }),
      deleteFile: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrendasService,
        { provide: TypeOrmPrendaRepository, useValue: repoMock },
        { provide: S3Service, useValue: s3Mock },
      ],
    }).compile();

    service = module.get<PrendasService>(PrendasService);
  });

  it('debe lanzar BadRequestException si no se adjunta archivo ni fotoUrl', async () => {
    await expect(
      service.create('user-1', null as any, {
        nombre: 'Camisa',
        tipoPrenda: TipoPrenda.SUPERIOR,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debe subir foto a S3 y crear prenda correctamente con archivo', async () => {
    const mockFile: any = {
      buffer: Buffer.from('fake-image'),
      originalname: 'camisa.jpg',
      mimetype: 'image/jpeg',
    };

    const result = await service.create('user-1', mockFile, {
      nombre: 'Camisa Blanca',
      tipoPrenda: TipoPrenda.SUPERIOR,
      color: 'Blanco',
    });

    expect(s3Mock.uploadFile).toHaveBeenCalledWith(mockFile, 'armario/user-1');
    expect(repoMock.createAndSave).toHaveBeenCalledWith({
      user: { id: 'user-1' },
      nombre: 'Camisa Blanca',
      tipoPrenda: TipoPrenda.SUPERIOR,
      color: 'Blanco',
      temporada: undefined,
      estilo: undefined,
      fotoUrl: 'http://localhost:9000/okarea-catalog/armario/user-1/prenda.jpg',
      s3Key: 'armario/user-1/prenda.jpg',
      notasAdicionales: {},
    });
    expect(result.id).toBe('prenda-1');
  });

  it('debe crear prenda con fotoUrl directa si no hay archivo', async () => {
    const result = await service.create('user-1', null as any, {
      nombre: 'Pantalón Negro',
      tipoPrenda: TipoPrenda.INFERIOR,
      color: 'Negro',
      fotoUrl: 'https://example.com/foto.jpg',
    });

    expect(s3Mock.uploadFile).not.toHaveBeenCalled();
    expect(repoMock.createAndSave).toHaveBeenCalledWith(
      expect.objectContaining({
        fotoUrl: 'https://example.com/foto.jpg',
        nombre: 'Pantalón Negro',
      }),
    );
    expect(result.id).toBe('prenda-1');
  });

  it('debe lanzar PrendaNotFoundException si no encuentra la prenda', async () => {
    repoMock.findById.mockResolvedValue(null);

    await expect(service.findOne('id-invalido', 'user-1')).rejects.toThrow(
      PrendaNotFoundException,
    );
  });
});
