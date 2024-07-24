import { Test, TestingModule } from '@nestjs/testing';
import { MongoDatasourceImplementationService } from './mongo.datasource.implementation.service';
import { getModelToken } from '@nestjs/mongoose';
import { SessionChat as SessionChatMongo } from '../persistence/mongodb/schemas/session-chat.schema';
import { BillingProvider } from '../../../shared/infrastructure/persistence/mongodb/schemas/billing-provider.schema';
import {
  BillingInfo,
  ChatCompletionEntity,
  SessionChat,
} from '../../models/entities/chat.entity';
import { ProviderEnum } from '../../../shared/models/enums/provider.enum';

const sessionChat: { [key: string]: any } = {
  _id: 'id',
  messages: [],
  payload: {},
  created_at: new Date(),
  updated_at: new Date(),
};

class SessionChatMongoMock {
  constructor(private _: SessionChat) {}

  static findOne = ({
    provider,
    session,
  }: {
    provider: string;
    session: string;
  }) => ({
    exec: () => ({
      provider,
      session,
      ...sessionChat,
    }),
  });

  static findOneAndUpdate = (data: { [key: string]: any }) => ({
    exec: () => ({
      ...data.filter,
      ...sessionChat,
    }),
  });

  public save = () => sessionChat;
}

const billingInfo: BillingInfo = {
  provider: ProviderEnum.OPENAI,
  payload: {},
  created_at: new Date(),
  updated_at: new Date(),
  session: 'session',
  context: {},
  id: 'id',
};

class BillingProviderMock {
  constructor(private _: BillingInfo) {}

  public save = () => billingInfo;
}

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
