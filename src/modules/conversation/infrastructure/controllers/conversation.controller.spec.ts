import { Test, TestingModule } from '@nestjs/testing';
import { ConversationController } from './conversation.controller';
import { FactoryService } from '../services/factory.service';
import { FetchHttpClientService } from '../../../shared/infrastructure/utils/fetch_http_client.service';
import { MongoDatasourceImplementationService } from '../datasources/mongo.datasource.implementation.service';
import { getModelToken } from '@nestjs/mongoose';
import { SessionChat as SessionChatMongo } from '../persistence/mongodb/schemas/session-chat.schema';
import { BillingProvider } from '../../../shared/infrastructure/persistence/mongodb/schemas/billing-provider.schema';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionDto, ChatCompletionImageDto } from '../dtos/chat.dto';
import { Response } from 'express';
import { CustomResponseInterface } from '../../../shared/models/interfaces/custom-response.interface';
import { HttpException } from '@nestjs/common';
import { SessionChatMongoMock } from '../mocks/session-class.mock';
import { BillingProviderMock } from '../mocks/billing-provider.mock';
import { ProviderEnum } from '../../../shared/models/enums/provider.enum';
import { ChatRepository } from '../../models/repositories/chat.repository';
import {
  ChatCompletionEntity,
  ChatCompletionImageEntity,
  ChatResponse,
} from '../../models/entities/chat.entity';

describe('ConversationController', () => {
  let controller: ConversationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationController],
      providers: [
        FactoryService,
        FetchHttpClientService,
        MongoDatasourceImplementationService,
        {
          provide: getModelToken(SessionChatMongo.name, 'ai_provider'),
          useValue: SessionChatMongoMock,
        },
        {
          provide: getModelToken(BillingProvider.name, 'ai_provider'),
          useValue: BillingProviderMock,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return {
                key,
                openai: {
                  apiKey: 'openai-api-key',
                  apiUrl: 'openai-api-url',
                },
                anthropic: {
                  apiKey: 'anthropic-api-key',
                  apiUrl: 'anthropic-api-url',
                },
                google: {
                  apiKey: 'google-api-key',
                },
                huggingFace: {
                  apiKey: 'hubbingface-api-key',
                },
              };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<ConversationController>(ConversationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should post chat', async () => {
    const responseObj = {
      status: (status: number) => ({
        send: (response: { [key: string]: any }) => {
          return {
            status,
            ...response,
          };
        },
      }),
    } as any;

    jest.spyOn(FactoryService, 'getProvider').mockReturnValue({
      chatCompletion(
        chat: ChatCompletionEntity,
        data: { [p: string]: any },
      ): Promise<ChatResponse> {
        return Promise.resolve({
          session: chat.session,
          ...data,
          payload: {},
        } as ChatResponse);
      },
    } as ChatRepository);

    const response: { [key: string]: any } = (await controller.postChat(
      {
        provider: ProviderEnum.OPENAI,
        message: 'message',
        sessionID: 'session-id',
      } as ChatCompletionDto,
      responseObj,
    )) as Response<CustomResponseInterface> | HttpException;

    expect(response).toBeDefined();
    expect(response.status).toBe(true);
  });

  it('should post chat image', async () => {
    const responseObj = {
      status: (status: number) => ({
        send: (response: { [key: string]: any }) => {
          return {
            status,
            ...response,
          };
        },
      }),
    } as any;

    jest.spyOn(FactoryService, 'getProvider').mockReturnValue({
      chatCompletionImage(
        chat: ChatCompletionImageEntity,
        data: { [p: string]: any },
      ): Promise<ChatResponse> {
        return Promise.resolve({
          session: chat.session,
          ...data,
          payload: {},
        } as ChatResponse);
      },
    } as ChatRepository);

    const response: { [key: string]: any } = (await controller.postImage(
      {
        provider: ProviderEnum.OPENAI,
        message: 'message',
        sessionID: 'session-id',
        image: 'image',
      } as ChatCompletionImageDto,
      responseObj,
    )) as Response<CustomResponseInterface> | HttpException;

    expect(response).toBeDefined();
    expect(response.status).toBe(true);
  });
});
