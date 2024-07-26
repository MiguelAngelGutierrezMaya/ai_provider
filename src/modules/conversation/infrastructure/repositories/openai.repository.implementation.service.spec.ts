import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiRepositoryImplementationService } from './openai.repository.implementation.service';
import { HttpUtilMock } from './mocks/http-util.mock';
import { ChatDataSourceMock } from './mocks/chat-data-source.mock';
import {
  ChatCompletionEntity,
  ChatResponse,
} from '../../models/entities/chat.entity';
import { ProviderEnum } from '../../../shared/models/enums/provider.enum';
import { OpenaiMessage } from '../../models/entities/openai.chat.entity';
import { OpenaiRoleEnum } from '../../models/enums/openai.enum';

describe('OpenaiRepositoryImplementationService', () => {
  let service: OpenaiRepositoryImplementationService;

  const chatCompletionEntity: ChatCompletionEntity = {
    provider: ProviderEnum.OPENAI,
    session: 'session',
    message: 'message',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenaiRepositoryImplementationService,
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

    service = module.get<OpenaiRepositoryImplementationService>(
      OpenaiRepositoryImplementationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an error if open ai env is not provided', async () => {
    try {
      await service.chatCompletion(chatCompletionEntity, {});
    } catch (error) {
      expect(error.message).toEqual('OpenAI API data not found');
    }
  });

  it('should return a chat response', async () => {
    const response: ChatResponse = await service.chatCompletion(
      chatCompletionEntity,
      {
        openai: {
          apiKey: 'apiKey',
          apiUrl: 'apiUrl',
        },
      },
    );

    const message = response.payload as OpenaiMessage;

    expect(response).toBeDefined();
    expect(message.role).toEqual(OpenaiRoleEnum.ASSISTANT);
  });
});
