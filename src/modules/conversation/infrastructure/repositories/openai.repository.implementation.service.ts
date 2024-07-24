import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatRepository } from '../../models/repositories/chat.repository';
import {
  BillingInfo,
  ChatCompletionEntity,
  ChatResponse,
  SessionChat,
  SessionMessage,
} from '../../models/entities/chat.entity';
import { HttpUtil } from '../../../shared/models/utils/http.util';
import {
  OpenaiChatEntityRequest,
  OpenaiChatEntityResponse,
  OpenaiMessage,
} from '../../models/entities/openai.chat.entity';
import { HttpRequestUseCase } from '../../../shared/application/usecases/http-request.use-case';
import {
  OpenaiModelEnum,
  OpenaiRoleEnum,
} from '../../models/enums/openai.enum';
import { CustomError } from '../../../shared/models/errors/custom.error';
import { ChatDatasource } from '../../models/datasource/chat.datasource';
import { ChatDataSourceUseCase } from '../../application/useCases/chat-data-source.use-case';

@Injectable()
export class OpenaiRepositoryImplementationService implements ChatRepository {
  private readonly logger = new Logger(
    OpenaiRepositoryImplementationService.name,
  );

  constructor(
    @Inject('HttpUtil') private readonly httpUtil: HttpUtil,
    @Inject('ChatDatasource') private readonly chatDatasource: ChatDatasource,
  ) {}

  async chatCompletion(
    chat: ChatCompletionEntity,
    data: { [key: string]: any },
  ): Promise<ChatResponse> {
    const { openai } = data;

    if (!openai) {
      throw CustomError.internal('OpenAI API data not found');
    }

    const payload: OpenaiChatEntityRequest = {
      messages: [
        {
          role: OpenaiRoleEnum.USER,
          content: chat.message,
        },
      ],
    } as OpenaiChatEntityRequest;

    if (!payload.messages || payload.messages.length === 0) {
      throw CustomError.badRequest('Messages not found');
    }

    this.logger.log(`Chat completion with payload: ${JSON.stringify(payload)}`);

    let session: SessionChat | null = await ChatDataSourceUseCase.getSessions(
      this.chatDatasource,
      chat,
    );

    if (!session) {
      const model: string = OpenaiModelEnum.GPT4O;

      const sessionChat: SessionChat = {
        provider: chat.provider,
        session: chat.session,
        payload: {
          model: model,
        },
        messages: [
          {
            role: OpenaiRoleEnum.SYSTEM,
            content: {
              text: 'You are a helpful assistant who talks like a pirate, your goal is to make social connection with your client to sell them as much liquor as possible',
            },
          },
          {
            role: OpenaiRoleEnum.USER,
            content: {
              text: payload.messages[payload.messages.length - 1].content,
            },
          },
        ],
      };

      this.logger.log(
        `Session not found, creating new session: ${JSON.stringify(sessionChat)}`,
      );

      session = await ChatDataSourceUseCase.saveSession(
        this.chatDatasource,
        sessionChat,
      );
    } else {
      const sessionMessage: SessionMessage = {
        role: OpenaiRoleEnum.USER,
        content: {
          text: payload.messages[payload.messages.length - 1].content,
        },
      };
      session.messages.push(sessionMessage);

      if (session.messages.length > 7) {
        throw CustomError.badRequest('Messages limit exceeded');
      }
    }

    this.logger.log(`Session found: ${JSON.stringify(session)}`);

    payload.messages = session.messages.map(
      (message: SessionMessage) =>
        ({
          role: message.role,
          content: message.content.text || '',
        }) as OpenaiMessage,
    );

    const url: string = openai.apiUrl || '';
    const apiKey: string = openai.apiKey || '';

    this.logger.log(`OpenAI API URL: ${url}, API Key: ${apiKey}`);

    const dataToBeSent: { [key: string]: any } = {
      url: `${url}/v1/chat/completions`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: {
        ...session.payload,
        ...payload,
      },
      isFormData: false,
    };

    this.logger.log(`Data to be sent: ${JSON.stringify(dataToBeSent)}`);

    const response: OpenaiChatEntityResponse =
      (await HttpRequestUseCase.makePostRequest(
        this.httpUtil,
        dataToBeSent,
      )) as OpenaiChatEntityResponse;

    this.logger.log(`Response from OpenAI: ${JSON.stringify(response)}`);

    let message: OpenaiMessage = {
      content: '',
      role: OpenaiRoleEnum.ASSISTANT,
    };

    if (response.choices && response.choices.length > 0) {
      message = response.choices[0].message;

      session.messages.push({
        role: OpenaiRoleEnum.ASSISTANT,
        content: { text: message.content },
      } as SessionMessage);

      const sessionUpdated: SessionChat =
        await ChatDataSourceUseCase.updateSession(this.chatDatasource, session);

      this.logger.log(`Session updated: ${JSON.stringify(sessionUpdated)}`);
    }

    this.logger.log(`Message from OpenAI: ${JSON.stringify(message)}`);

    const billingInfo: BillingInfo = {
      context: session,
      provider: chat.provider,
      session: chat.session,
      payload: response,
    };

    const billingResponse: BillingInfo =
      await ChatDataSourceUseCase.storeBillingResponse(
        this.chatDatasource,
        billingInfo,
      );

    this.logger.log(`Billing response: ${JSON.stringify(billingResponse)}`);

    return {
      session: chat.session,
      payload: message,
    };
  }
}
