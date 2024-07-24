import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatRepository } from '../../models/repositories/chat.repository';
import {
  BillingInfo,
  ChatEntity,
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
    chat: ChatEntity,
    data: { [key: string]: any },
  ): Promise<ChatResponse> {
    const { openai } = data;

    if (!openai) {
      throw CustomError.internal('OpenAI API data not found');
    }

    const payload: OpenaiChatEntityRequest =
      chat.payload as OpenaiChatEntityRequest;

    if (!payload.messages || payload.messages.length === 0) {
      throw CustomError.badRequest('Messages not found');
    }

    this.logger.log(`Chat completion with payload: ${JSON.stringify(payload)}`);

    let session: SessionChat | null =
      await this.chatDatasource.getSession(chat);

    const model: string = OpenaiModelEnum.GPT4O;

    if (!session) {
      const sessionChat: SessionChat = {
        provider: chat.provider,
        session: chat.session,
        payload: {
          model: model,
        },
        messages: [
          {
            role: OpenaiRoleEnum.SYSTEM,
            content:
              'You are a helpful assistant who talks like a pirate, your goal is to make social connection with your client to sell them as much liquor as possible',
          },
          {
            role: OpenaiRoleEnum.USER,
            content: payload.messages[payload.messages.length - 1].content,
          },
        ],
      };

      this.logger.log(
        `Session not found, creating new session: ${JSON.stringify(sessionChat)}`,
      );

      session = await this.chatDatasource.saveSession(sessionChat);
    } else {
      const sessionMessage: SessionMessage = {
        role: OpenaiRoleEnum.USER,
        content: payload.messages[payload.messages.length - 1].content,
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
          content: message.content,
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
        model: model,
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
        content: message.content,
      } as SessionMessage);

      const sessionUpdated = await this.chatDatasource.updateSession(session);

      this.logger.log(`Session updated: ${JSON.stringify(sessionUpdated)}`);
    }

    this.logger.log(`Message from OpenAI: ${JSON.stringify(message)}`);

    const billingResponse: BillingInfo =
      await this.chatDatasource.storeBillingResponse({
        context: session,
        provider: chat.provider,
        session: chat.session,
        payload: response,
      });

    this.logger.log(`Billing response: ${JSON.stringify(billingResponse)}`);

    return {
      session: chat.session,
      payload: message,
    };
  }
}
