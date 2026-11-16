import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PrendasService } from './prendas.service';
import { Prenda, TipoPrenda } from './entities/prenda.entity';
import { S3Service } from '../../common/s3.service';
import { BadRequestException } from '@nestjs/common';

describe('PrendasService', () => {
  let service: PrendasService;
  let repoMock: any;
  let s3Mock: any;

  beforeEach(async () => {
    repoMock = {
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) => Promise.resolve({ id: 'prenda-1', ...entity })),
      find: jest.fn(),
      findOne: jest.fn(),
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
        { provide: getRepositoryToken(Prenda), useValue: repoMock },
        { provide: S3Service, useValue: s3Mock },
      ],
    }).compile();

    service = module.get<PrendasService>(PrendasService);
  });

  it('debe lanzar BadRequestException si no se adjunta archivo', async () => {
    await expect(
      service.create('user-1', null as any, {
        nombre: 'Camisa',
        tipoPrenda: TipoPrenda.SUPERIOR,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debe subir foto a S3 y crear prenda correctamente', async () => {
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

    expect(s3Mock.uploadFile).toHaveBeenCalled();
    expect(repoMock.save).toHaveBeenCalled();
    expect(result.nombre).toBe('Camisa Blanca');
    expect(result.fotoUrl).toContain('prenda.jpg');
  });

  it('debe listar prendas de un usuario', async () => {
    repoMock.find.mockResolvedValue([
      { id: 'prenda-1', nombre: 'Pantalón Negro', tipoPrenda: TipoPrenda.INFERIOR },
    ]);

    const result = await service.findAllByUser('user-1');
    expect(result).toHaveLength(1);
    expect(repoMock.find).toHaveBeenCalled();
  });
});
