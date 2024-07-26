import { ChatRepository } from '../../models/repositories/chat.repository';
import {
  ChatCompletionEntity,
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
}
