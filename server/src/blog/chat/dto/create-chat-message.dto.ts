import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import type { ChatSenderType } from '../entities/chat-message.entity';

export class CreateChatMessageDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsIn(['user', 'admin'])
  sender: ChatSenderType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  @IsOptional()
  userEmail?: string;
}
