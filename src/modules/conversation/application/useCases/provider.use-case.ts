import { ChatRepository } from '../../models/repositories/chat.repository';
import {
  ChatCompletionEntity,
  ChatCompletionImageEntity,
  ChatResponse,
} from '../../models/entities/chat.entity';

export class ProviderUseCase {
  //
  // This class is a use case for the ChatRepository
  // It is used to chat completion
  // - provider: ChatRepository
  // - entity: ChatCompletionEntity
  // - data: { [key: string]: any }
  // - returns: Promise<ChatResponse>
  //
  static async chatCompletion(
    provider: ChatRepository,
    entity: ChatCompletionEntity,
    data: { [key: string]: any },
  ): Promise<ChatResponse> {
    return await provider.chatCompletion(entity, data);
  }

  //
  // This class is a use case for the ChatRepository
  // It is used to chat completion image
  // - provider: ChatRepository
  // - entity: ChatCompletionImageEntity
  // - data: { [key: string]: any }
  // - returns: Promise<ChatResponse>
  //
  static async chatCompletionImage(
    provider: ChatRepository,
    entity: ChatCompletionImageEntity,
    data: { [key: string]: any },
  ): Promise<ChatResponse> {
    return await provider.chatCompletionImage(entity, data);
  }
}
