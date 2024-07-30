import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatRepository } from '../../models/repositories/chat.repository';
import { ChatDatasource } from '../../models/datasource/chat.datasource';
import {
  BillingInfo,
  ChatCompletionEntity,
  ChatCompletionImageEntity,
  ChatResponse,
  SessionChat,
  SessionMessage,
} from '../../models/entities/chat.entity';
import { CustomError } from '../../../shared/models/errors/custom.error';
import { HfInference } from '@huggingface/inference';
import {
  HugginFaceMessage,
  HuggingFaceChatEntityRequest,
} from '../../models/entities/huggingface.chat.entity';
import {
  HugginFaceModelEnum,
  HugginFaceRoleEnum,
} from '../../models/enums/hugginface.enum';
import type { ChatCompletionOutput } from '@huggingface/tasks';

@Injectable()
export class HuggingfaceRepositoryImplementationService
  implements ChatRepository
{
  private readonly logger = new Logger(
    HuggingfaceRepositoryImplementationService.name,
  );

  constructor(
    @Inject('ChatDatasource') private readonly chatDatasource: ChatDatasource,
  ) {}

  async chatCompletion(
    chat: ChatCompletionEntity,
    data: { [key: string]: any },
  ): Promise<ChatResponse> {
    const { huggingFace } = data;

    if (!huggingFace) {
      throw CustomError.internal('HuggingFace API data not found');
    }

    const payload: HuggingFaceChatEntityRequest = {
      messages: [
        {
          role: HugginFaceRoleEnum.USER,
          content: chat.message,
        },
      ],
    } as HuggingFaceChatEntityRequest;

    if (!payload.messages || payload.messages.length === 0) {
      throw CustomError.badRequest('Messages not found');
    }

    this.logger.log(`Chat completion with payload: ${JSON.stringify(payload)}`);

    let session: SessionChat | null =
      await this.chatDatasource.getSession(chat);

    if (!session) {
      const model: string = HugginFaceModelEnum.MISTRAL_7B_INSTRUCT_V_0_2;

      const sessionChat: SessionChat = {
        provider: chat.provider,
        session: chat.session,
        payload: {
          model: model,
          max_tokens: 500,
          temperature: 0.1,
          seed: 0,
        },
        messages: [
          {
            role: HugginFaceRoleEnum.USER,
            content: {
              text: 'You are a helpful assistant who talks like a pirate, your goal is to make social connection with your client to sell them as much liquor as possible',
            },
          },
          {
            role: HugginFaceRoleEnum.ASSISTANT,
            content: { text: 'Ok, I will help you with that.' },
          },
          {
            role: HugginFaceRoleEnum.USER,
            content: {
              text: payload.messages[payload.messages.length - 1].content,
            },
          },
        ],
      };

      this.logger.log(
        `Session not found, creating new session: ${JSON.stringify(sessionChat)}`,
      );

      session = await this.chatDatasource.saveSession(sessionChat);
    } else {
      const sessionMessage: SessionMessage = {
        role: HugginFaceRoleEnum.USER,
        content: {
          text: payload.messages[payload.messages.length - 1].content,
        },
      };

      session.messages.push(sessionMessage);

      if (session.messages.length > 8) {
        throw CustomError.badRequest('Messages limit exceeded');
      }
    }

    this.logger.log(`Session found: ${JSON.stringify(session)}`);

    payload.messages = session.messages.map(
      (message: SessionMessage) =>
        ({
          role: message.role,
          content: message.content.text || '',
        }) as HugginFaceMessage,
    );

    const apiKey: string = huggingFace.apiKey || '';

    this.logger.log(`API Key: ${apiKey}`);

    const dataToBeSent: { [key: string]: any } = {
      ...session.payload,
      ...payload,
    };

    this.logger.log(`Data to be sent: ${JSON.stringify(dataToBeSent)}`);

    const response: ChatCompletionOutput = await this.processChatResponse(
      apiKey,
      dataToBeSent,
    );

    this.logger.log(`Response from Hugging face: ${JSON.stringify(response)}`);

    let message: HugginFaceMessage = {
      content: '',
      role: HugginFaceRoleEnum.ASSISTANT,
    };

    if (response.choices && response.choices.length > 0) {
      message = response.choices[0].message as HugginFaceMessage;

      session.messages.push({
        role: HugginFaceRoleEnum.ASSISTANT,
        content: { text: message.content },
      } as SessionMessage);

      const sessionUpdated = await this.chatDatasource.updateSession(session);

      this.logger.log(`Session updated: ${JSON.stringify(sessionUpdated)}`);
    }

    this.logger.log(`Message from Hugging face: ${JSON.stringify(message)}`);

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
    } as ChatResponse;
  }

  async processChatResponse(
    apiKey: string,
    dataToBeSent: { [key: string]: any },
  ): Promise<ChatCompletionOutput> {
    const huggingFaceInference: HfInference = new HfInference(apiKey, {});
    return await huggingFaceInference.chatCompletion(dataToBeSent);
  }

  async chatCompletionImage(
    chat: ChatCompletionImageEntity,
    data: { [key: string]: any },
  ): Promise<ChatResponse> {
    console.log('chatCompletionImage', chat, data);

    return {} as ChatResponse;
  }
}
