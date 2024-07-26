import { Test, TestingModule } from '@nestjs/testing';
import { MongoDatasourceImplementationService } from './mongo.datasource.implementation.service';
import { getModelToken } from '@nestjs/mongoose';
import { SessionChat as SessionChatMongo } from '../persistence/mongodb/schemas/session-chat.schema';
import { BillingProvider } from '../../../shared/infrastructure/persistence/mongodb/schemas/billing-provider.schema';
import {
  ChatCompletionEntity,
  SessionChat,
} from '../../models/entities/chat.entity';
import { ProviderEnum } from '../../../shared/models/enums/provider.enum';
import { sessionChat, SessionChatMongoMock } from '../mocks/session-class.mock';
import {
  billingInfo,
  BillingProviderMock,
} from '../mocks/billing-provider.mock';

describe('MongoDatasourceImplementationService', () => {
  let service: MongoDatasourceImplementationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoDatasourceImplementationService,
        {
          provide: getModelToken(SessionChatMongo.name, 'ai_provider'),
          useValue: SessionChatMongoMock,
        },
        {
          provide: getModelToken(BillingProvider.name, 'ai_provider'),
          useValue: BillingProviderMock,
        },
      ],
    }).compile();

    service = module.get<MongoDatasourceImplementationService>(
      MongoDatasourceImplementationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get session', async () => {
    // jest.spyOn(service, 'getSession').mockResolvedValue(sessionChat as any);
    const sessionResponse = await service.getSession({
      provider: ProviderEnum.OPENAI,
      session: 'session',
      message: 'message',
    } as ChatCompletionEntity);

    expect(sessionResponse.id).toBe(sessionChat._id);
  });

  it('should save session', async () => {
    const sessionResponse: SessionChat = await service.saveSession({
      session: 'session',
      provider: ProviderEnum.OPENAI,
      messages: [],
      payload: {},
      created_at: new Date(),
      updated_at: new Date(),
    } as SessionChat);

    expect(sessionResponse.id).toBe(sessionChat._id);
  });

  it('should update session', async () => {
    const sessionResponse: SessionChat = await service.updateSession({
      session: 'session',
      provider: ProviderEnum.OPENAI,
      messages: [],
      payload: {},
      created_at: new Date(),
      updated_at: new Date(),
    } as SessionChat);

    expect(sessionResponse.id).toBe(sessionChat._id);
  });

  it('should should billing info', async () => {
    const billingInfoResponse = await service.storeBillingResponse(billingInfo);

    expect(billingInfoResponse.provider).toBe(billingInfo.provider);
  });
});
