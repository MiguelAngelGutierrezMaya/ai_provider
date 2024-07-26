import { Test, TestingModule } from '@nestjs/testing';
import { HuggingfaceRepositoryImplementationService } from './huggingface.repository.implementation.service';
import { ChatDataSourceMock } from './mocks/chat-data-source.mock';
import { HugginFaceRoleEnum } from '../../models/enums/hugginface.enum';
import {
  ChatCompletionEntity,
  ChatResponse,
} from '../../models/entities/chat.entity';
import { ProviderEnum } from '../../../shared/models/enums/provider.enum';
import { HugginFaceMessage } from '../../models/entities/huggingface.chat.entity';

describe('HuggingfaceRepositoryImplementationService', () => {
  let service: HuggingfaceRepositoryImplementationService;

  const chatCompletionEntity: ChatCompletionEntity = {
    provider: ProviderEnum.HUGGING_FACE,
    session: 'session',
    message: 'message',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HuggingfaceRepositoryImplementationService,
        {
          provide: 'ChatDatasource',
          useClass: ChatDataSourceMock,
        },
      ],
    }).compile();

    service = module.get<HuggingfaceRepositoryImplementationService>(
      HuggingfaceRepositoryImplementationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a chat text response', async () => {
    const textResponse = 'response';

    jest.spyOn(service, 'processChatResponse').mockImplementation(
      (
        apiKey: string,
        dataToBeSent: {
          [key: string]: any;
        },
      ) =>
        ({
          choices: [
            {
              message: {
                content: textResponse,
                apiKey: apiKey,
                dataToBeSent: dataToBeSent,
                role: HugginFaceRoleEnum.ASSISTANT,
              },
            },
          ],
        }) as any,
    );

    const response: ChatResponse = await service.chatCompletion(
      chatCompletionEntity,
      {
        huggingFace: {
          apiKey: 'apiKey',
        },
      },
    );

    const message: HugginFaceMessage = response.payload as HugginFaceMessage;

    expect(response).toBeDefined();
    expect(message.content).toEqual(textResponse);
  });
});
