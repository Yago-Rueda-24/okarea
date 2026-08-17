import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatSession } from './entities/chat-session.entity';
import { ChatMessage } from './entities/chat-message.entity';

describe('ChatService', () => {
  let service: ChatService;
  let sessionRepoMock: any;
  let messageRepoMock: any;

  beforeEach(async () => {
    sessionRepoMock = {
      findOne: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) => Promise.resolve({ id: 's-1', ...entity })),
      find: jest.fn(),
    };

    messageRepoMock = {
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) => Promise.resolve({ id: 'm-1', ...entity, createdAt: new Date() })),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      find: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(ChatSession),
          useValue: sessionRepoMock,
        },
        {
          provide: getRepositoryToken(ChatMessage),
          useValue: messageRepoMock,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe guardar un mensaje de usuario creando la sesión si no existe', async () => {
    sessionRepoMock.findOne.mockResolvedValue(null);
    const dto = {
      sessionId: 'session-xyz',
      sender: 'user' as const,
      content: 'Hola, consulta de producto',
    };

    const result = await service.saveMessage(dto);

    expect(sessionRepoMock.create).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: 'session-xyz' }),
    );
    expect(messageRepoMock.save).toHaveBeenCalled();
    expect(result.content).toBe('Hola, consulta de producto');
  });

  it('debe marcar mensajes como leídos por el usuario al consultar', async () => {
    messageRepoMock.find.mockResolvedValue([
      { id: 'm-1', sessionId: 'session-xyz', sender: 'admin', content: 'Respuesta' },
    ]);

    const messages = await service.getMessagesBySession('session-xyz', 'user');

    expect(messageRepoMock.update).toHaveBeenCalledWith(
      { sessionId: 'session-xyz', readByUser: false },
      { readByUser: true },
    );
    expect(messages.length).toBe(1);
  });
});
