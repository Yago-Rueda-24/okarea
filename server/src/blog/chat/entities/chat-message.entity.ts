import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type ChatSenderType = 'user' | 'admin';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  sessionId: string;

  @Column({ type: 'varchar' })
  sender: ChatSenderType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: false })
  readByAdmin: boolean;

  @Column({ type: 'boolean', default: false })
  readByUser: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
