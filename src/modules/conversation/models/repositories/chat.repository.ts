import { ChatCompletionEntity, ChatResponse } from '../entities/chat.entity';

export abstract class ChatRepository {
  abstract chatCompletion(
    chat: ChatCompletionEntity,
    data: { [key: string]: any },
  ): Promise<ChatResponse>;
}
