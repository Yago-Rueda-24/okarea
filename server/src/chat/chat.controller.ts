import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  async sendMessage(@Body() dto: CreateChatMessageDto) {
    return this.chatService.saveMessage(dto);
  }

  @Get('messages')
  async getMessages(
    @Query('sessionId') sessionId: string,
    @Query('markReadBy') markReadBy?: 'user' | 'admin',
  ) {
    if (!sessionId) {
      return [];
    }
    return this.chatService.getMessagesBySession(sessionId, markReadBy);
  }

  @Get('sessions')
  @UseGuards(ApiKeyGuard)
  async getAllSessions() {
    return this.chatService.getAllSessions();
  }
}
