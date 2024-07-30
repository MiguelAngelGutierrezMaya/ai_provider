import { ChatCompletionDto, ChatCompletionImageDto } from '../dtos/chat.dto';
import {
  BillingInfo,
  ChatCompletionEntity,
  ChatCompletionImageEntity,
  SessionChat,
  SessionMessage,
} from '../../models/entities/chat.entity';
import {
  ProviderEnum,
  ProviderType,
} from '../../../shared/models/enums/provider.enum';
import { CustomError } from '../../../shared/models/errors/custom.error';

export class ChatMapper {
  static chatDtoToEntity(chatDto: ChatCompletionDto): ChatCompletionEntity {
    const { provider, message, sessionID } = chatDto;

    if (!provider) {
      throw CustomError.badRequest('Provider is required');
    }

    const providersTypes: ProviderType[] = Object.values(ProviderEnum).map(
      (value: ProviderType) => value,
    );

    if (!providersTypes.includes(provider as ProviderType)) {
      throw CustomError.badRequest('Invalid provider');
    }

    if (!message) {
      throw CustomError.badRequest('Message is required');
    }

    if (!sessionID) {
      throw CustomError.badRequest('Session ID is required');
    }

    return {
      provider: provider as ProviderType,
      session: sessionID,
      message: message,
    };
  }

  static chatImageDtoToEntity(
    chatDto: ChatCompletionImageDto,
  ): ChatCompletionImageEntity {
    const { provider, message, sessionID, image } = chatDto;

    const chatCompletionEntity: ChatCompletionEntity = this.chatDtoToEntity({
      message: message,
      provider: provider,
      sessionID: sessionID,
    } as ChatCompletionDto);

    if (!image) {
      throw CustomError.badRequest('Image is required');
    }

    return {
      ...chatCompletionEntity,
      image: image,
    } as ChatCompletionImageEntity;
  }

  static sessionSchemaToEntity(sessionSchema: {
    [key: string]: any;
  }): SessionChat {
    const {
      _id,
      provider,
      session,
      messages,
      payload,
      created_at,
      updated_at,
    } = sessionSchema;

    const sessionMessages: SessionMessage[] = (messages || []).map(
      (message: { [key: string]: any }) =>
        ({
          id: message._id || '',
          role: message.role || '',
          content: message.content || '',
          created_at: message.created_at || new Date(),
          updated_at: message.updated_at || new Date(),
        }) as SessionMessage,
    );

    return {
      id: _id || '',
      payload: payload,
      provider: (provider || '') as ProviderType,
      session: session || '',
      messages: sessionMessages,
      created_at: created_at || new Date(),
      updated_at: updated_at || new Date(),
    };
  }

  static billingSchemaToEntity(billingSchema: {
    [key: string]: any;
  }): BillingInfo {
    const { _id, provider, session, data, created_at, updated_at, context } =
      billingSchema;

    return {
      id: _id || '',
      context: context || {},
      provider: (provider || '') as ProviderType,
      session: session || '',
      payload: data || {},
      created_at: created_at || new Date(),
      updated_at: updated_at || new Date(),
    };
  }
}
