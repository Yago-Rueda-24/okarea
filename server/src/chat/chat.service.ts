import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly sessionRepository: Repository<ChatSession>,
    @InjectRepository(ChatMessage)
    private readonly messageRepository: Repository<ChatMessage>,
  ) {}

  async saveMessage(dto: CreateChatMessageDto): Promise<ChatMessage> {
    let session = await this.sessionRepository.findOne({
      where: { sessionId: dto.sessionId },
    });

    if (!session) {
      session = this.sessionRepository.create({
        sessionId: dto.sessionId,
        userName: dto.userName || null,
        userEmail: dto.userEmail || null,
      });
    } else {
      if (dto.userName) session.userName = dto.userName;
      if (dto.userEmail) session.userEmail = dto.userEmail;
    }

    session.updatedAt = new Date();
    await this.sessionRepository.save(session);

    const message = this.messageRepository.create({
      sessionId: dto.sessionId,
      sender: dto.sender,
      content: dto.content,
      readByAdmin: dto.sender === 'admin',
      readByUser: dto.sender === 'user',
    });

    return this.messageRepository.save(message);
  }

  async getMessagesBySession(
    sessionId: string,
    markReadBy?: 'user' | 'admin',
  ): Promise<ChatMessage[]> {
    if (markReadBy === 'user') {
      await this.messageRepository.update(
        { sessionId, readByUser: false },
        { readByUser: true },
      );
    } else if (markReadBy === 'admin') {
      await this.messageRepository.update(
        { sessionId, readByAdmin: false },
        { readByAdmin: true },
      );
    }

    return this.messageRepository.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
    });
  }

  async getAllSessions(): Promise<
    {
      session: ChatSession;
      lastMessage: ChatMessage | null;
      unreadCount: number;
    }[]
  > {
    const sessions = await this.sessionRepository.find({
      order: { updatedAt: 'DESC' },
    });

    const result: {
      session: ChatSession;
      lastMessage: ChatMessage | null;
      unreadCount: number;
    }[] = [];

    for (const session of sessions) {
      const lastMessage = await this.messageRepository.findOne({
        where: { sessionId: session.sessionId },
        order: { createdAt: 'DESC' },
      });

      const unreadCount = await this.messageRepository.count({
        where: {
          sessionId: session.sessionId,
          readByAdmin: false,
        },
      });

      result.push({
        session,
        lastMessage,
        unreadCount,
      });
    }

    return result;
  }
}
