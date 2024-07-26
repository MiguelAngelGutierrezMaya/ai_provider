import { Test, TestingModule } from '@nestjs/testing';
import { AnthropicRepositoryImplementationService } from './anthropic.repository.implementation.service';
import { HttpUtilMock } from './mocks/http-util.mock';
import { ChatDataSourceMock } from './mocks/chat-data-source.mock';
import {
  ChatCompletionEntity,
  ChatResponse,
} from '../../models/entities/chat.entity';
import { ProviderEnum } from '../../../shared/models/enums/provider.enum';
import { AnthropicMessageContent } from '../../models/entities/anthropic.chat.entity';
import { AnthropicContentType } from '../../models/enums/anthropic.enum';

describe('AnthropicRepositoryImplementationService', () => {
  let service: AnthropicRepositoryImplementationService;

  const chatCompletionEntity: ChatCompletionEntity = {
    provider: ProviderEnum.ANTHROPIC,
    session: 'session',
    message: 'message',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnthropicRepositoryImplementationService,
        {
          provide: 'HttpUtil',
          useClass: HttpUtilMock,
        },
        {
          provide: 'ChatDatasource',
          useClass: ChatDataSourceMock,
        },
      ],
    }).compile();

    service = module.get<AnthropicRepositoryImplementationService>(
      AnthropicRepositoryImplementationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an error if anthropic env is not provided', async () => {
    try {
      await service.chatCompletion(chatCompletionEntity, {});
    } catch (error) {
      expect(error.message).toEqual('Anthropic API data not found');
    }
  });

  it('should return a chat text response', async () => {
    const response: ChatResponse = await service.chatCompletion(
      chatCompletionEntity,
      {
        anthropic: {
          apiKey: 'apiKey',
          apiUrl: 'apiUrl',
        },
      },
    );

    const message: AnthropicMessageContent =
      response.payload as AnthropicMessageContent;

    expect(response).toBeDefined();
    expect(message.type).toEqual(AnthropicContentType.TEXT);
  });
});
