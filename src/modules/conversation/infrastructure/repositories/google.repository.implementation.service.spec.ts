import { Test, TestingModule } from '@nestjs/testing';
import { GoogleRepositoryImplementationService } from './google.repository.implementation.service';
import { ChatDataSourceMock } from './mocks/chat-data-source.mock';
import {
  ChatCompletionEntity,
  ChatResponse,
} from '../../models/entities/chat.entity';
import { ProviderEnum } from '../../../shared/models/enums/provider.enum';
import { GoogleMessagePart } from '../../models/entities/google.chat.entity';
import {
  GenerateContentResult,
  ModelParams,
  StartChatParams,
} from '@google/generative-ai';
import { GoogleRoleEnum } from '../../models/enums/google.enum';

describe('GoogleRepositoryImplementationService', () => {
  let service: GoogleRepositoryImplementationService;

  const chatCompletionEntity: ChatCompletionEntity = {
    provider: ProviderEnum.GOOGLE,
    session: 'session',
    message: 'message',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleRepositoryImplementationService,
        {
          provide: 'ChatDatasource',
          useClass: ChatDataSourceMock,
        },
      ],
    }).compile();

    service = module.get<GoogleRepositoryImplementationService>(
      GoogleRepositoryImplementationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an error if google env is not provided', async () => {
    try {
      await service.chatCompletion(chatCompletionEntity, {});
    } catch (error) {
      expect(error.message).toEqual('Google API data not found');
    }
  });

  it('should return a chat text response', async () => {
    const textResponse = 'response';

    jest
      .spyOn(service, 'processChatResponse')
      .mockImplementation(
        (
          apiKey: string,
          prompt: string,
          modelParams: ModelParams,
          startChatParams: StartChatParams,
        ): Promise<GenerateContentResult> => {
          return Promise.resolve({
            response: {
              text: () => textResponse,
              usageMetadata: {},
              promptFeedback: {},
              candidates: [
                {
                  content: {
                    role: GoogleRoleEnum.MODEL,
                    parts: [
                      {
                        text: apiKey + prompt,
                        fileData: modelParams,
                        executableCode: startChatParams,
                      },
                    ],
                  },
                },
              ],
            },
          } as GenerateContentResult);
        },
      );

    const response: ChatResponse = await service.chatCompletion(
      chatCompletionEntity,
      {
        google: {
          apiKey: 'apiKey',
          apiUrl: 'apiUrl',
        },
      },
    );

    const message: GoogleMessagePart = response.payload as GoogleMessagePart;

    expect(response).toBeDefined();
    expect(message.text).toEqual(textResponse);
  });
});
