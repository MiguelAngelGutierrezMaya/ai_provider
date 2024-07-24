import { ChatRepository } from '../../models/repositories/chat.repository';
import {
  ChatCompletionEntity,
  ChatResponse,
} from '../../models/entities/chat.entity';

interface ProviderFactory {
  getProvider(provider: string): ChatRepository | null;
}

export class ProviderUseCase {
  //
  // This class is a use case for the ChatRepository
  // It is used to get the provider
  // - service: ProviderFactory
  // - provider: string
  // - returns: ChatRepository | null
  //
  static getProvider(
    service: ProviderFactory,
    provider: string,
  ): ChatRepository | null {
    return service.getProvider(provider);
  }

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
