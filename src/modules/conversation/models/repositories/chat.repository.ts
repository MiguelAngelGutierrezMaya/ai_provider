import { ChatEntity, ChatResponse } from '../entities/chat.entity';

export abstract class ChatRepository {
  abstract chatCompletion(
    chat: ChatEntity,
    data: { [key: string]: any },
  ): Promise<ChatResponse>;
}
