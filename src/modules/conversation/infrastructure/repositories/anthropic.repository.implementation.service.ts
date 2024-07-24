import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatRepository } from '../../models/repositories/chat.repository';
import { HttpUtil } from '../../../shared/models/utils/http.util';
import {
  BillingInfo,
  ChatEntity,
  ChatResponse,
  SessionChat,
  SessionMessage,
} from '../../models/entities/chat.entity';
import {
  AnthropicChatEntityRequest,
  AnthropicChatEntityResponse,
  AnthropicMessage,
  AnthropicMessageContent,
} from '../../models/entities/anthropic.chat.entity';
import { HttpRequestUseCase } from '../../../shared/application/usecases/http-request.use-case';
import {
  AnthropicContentType,
  AnthropicModelEnum,
} from '../../models/enums/anthropic.enum';
import { CustomError } from '../../../shared/models/errors/custom.error';
import { ChatDatasource } from '../../models/datasource/chat.datasource';
import {
  OpenaiModelEnum,
  OpenaiRoleEnum,
} from '../../models/enums/openai.enum';
import { OpenaiMessage } from '../../models/entities/openai.chat.entity';

@Injectable()
export class AnthropicRepositoryImplementationService
  implements ChatRepository
{
  private readonly logger: Logger = new Logger(
    AnthropicRepositoryImplementationService.name,
  );

  constructor(
    @Inject('HttpUtil') private readonly httpUtil: HttpUtil,
    @Inject('ChatDatasource') private readonly chatDatasource: ChatDatasource,
  ) {}

  async chatCompletion(
    chat: ChatEntity,
    data: { [key: string]: any },
  ): Promise<ChatResponse> {
    const { anthropic } = data;

    if (!anthropic) {
      throw CustomError.internal('Anthropic API data not found');
    }

    const payload: AnthropicChatEntityRequest =
      chat.payload as AnthropicChatEntityRequest;

    this.logger.log(`Chat completion with payload: ${JSON.stringify(payload)}`);

    let session: SessionChat | null =
      await this.chatDatasource.getSession(chat);

    const model: string = AnthropicModelEnum.CLAUDE_3_5_SONNET;

    if (!session) {
      const sessionChat: SessionChat = {
        provider: chat.provider,
        session: chat.session,
        payload: {
          model: model,
          max_tokens: 1024,
          system:
            'You are a helpful assistant who talks like a pirate, your goal is to make social connection with your client to sell them as much liquor as possible',
        },
        messages: [
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
        }) as AnthropicMessage,
    );

    const url: string = anthropic.apiUrl || '';
    const apiKey: string = anthropic.apiKey || '';
    const version: string = '2023-06-01';

    this.logger.log(
      `Anthropic API URL: ${url}, API Key: ${apiKey}, Version: ${version}`,
    );

    const dataToBeSent: { [key: string]: any } = {
      url: `${url}/v1/messages`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'anthropic-version': version,
        'x-api-key': apiKey,
      },
      body: {
        ...session.payload,
        ...payload,
      },
      isFormData: false,
    };

    this.logger.log(`Data to be sent: ${JSON.stringify(dataToBeSent)}`);

    const response: AnthropicChatEntityResponse =
      (await HttpRequestUseCase.makePostRequest(
        this.httpUtil,
        dataToBeSent,
      )) as AnthropicChatEntityResponse;

    this.logger.log(`Response from Anthropic: ${JSON.stringify(response)}`);

    let message: AnthropicMessageContent = {
      type: AnthropicContentType.TEXT,
      text: '',
    };

    if (response.content && response.content.length > 0) {
      message = response.content[0] as AnthropicMessageContent;

      session.messages.push({
        role: OpenaiRoleEnum.ASSISTANT,
        content: message.text || '',
      } as SessionMessage);

      const sessionUpdated = await this.chatDatasource.updateSession(session);

      this.logger.log(`Session updated: ${JSON.stringify(sessionUpdated)}`);
    }

    this.logger.log(`Message from Anthropic: ${JSON.stringify(message)}`);

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
