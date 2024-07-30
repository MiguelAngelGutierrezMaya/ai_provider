import {
  ChatCompletionEntity,
  ChatCompletionImageEntity,
  ChatResponse,
} from '../entities/chat.entity';

export abstract class ChatRepository {
  abstract chatCompletion(
    chat: ChatCompletionEntity,
    data: { [key: string]: any },
  ): Promise<ChatResponse>;

  abstract chatCompletionImage(
    chat: ChatCompletionImageEntity,
    data: { [key: string]: any },
  ): Promise<ChatResponse>;
}
