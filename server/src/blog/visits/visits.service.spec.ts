import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VisitsService } from './visits.service';
import { Visit } from './entities/visit.entity';

describe('VisitsService', () => {
  let service: VisitsService;
  let repositoryMock: any;

  beforeEach(async () => {
    repositoryMock = {
      findOne: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) => Promise.resolve({ id: 'uuid-1', ...entity, createdAt: new Date() })),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitsService,
        {
          provide: getRepositoryToken(Visit),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<VisitsService>(VisitsService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe descartar la visita si el User-Agent es un Bot', async () => {
    const result = await service.recordVisit({ path: '/' }, '127.0.0.1', 'Googlebot/2.1');
    expect(result).toEqual({ recorded: false, reason: 'bot_ignored' });
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });

  it('debe registrar una visita válida', async () => {
    repositoryMock.findOne.mockResolvedValue(null);
    const result = await service.recordVisit({ path: '/bolsos' }, '192.168.1.1', 'Mozilla/5.0');
    expect(result).toEqual({ recorded: true });
    expect(repositoryMock.save).toHaveBeenCalled();
  });

  it('debe respetar el cooldown de 5 minutos', async () => {
    repositoryMock.findOne.mockResolvedValue({ id: 'prev-id', path: '/bolsos' });
    const result = await service.recordVisit({ path: '/bolsos' }, '192.168.1.1', 'Mozilla/5.0');
    expect(result).toEqual({ recorded: false, reason: 'cooldown' });
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });
});
