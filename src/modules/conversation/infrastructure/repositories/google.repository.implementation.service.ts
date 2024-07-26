import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatRepository } from '../../models/repositories/chat.repository';
import { ChatDatasource } from '../../models/datasource/chat.datasource';
import {
  BillingInfo,
  ChatCompletionEntity,
  ChatResponse,
  SessionChat,
  SessionMessage,
} from '../../models/entities/chat.entity';
import { CustomError } from '../../../shared/models/errors/custom.error';
import {
  GoogleModelEnum,
  GoogleRoleEnum,
} from '../../models/enums/google.enum';
import {
  ChatSession,
  GenerateContentResult,
  GenerativeModel,
  GoogleGenerativeAI,
  ModelParams,
  StartChatParams,
} from '@google/generative-ai';
import {
  GoogleChatEntityRequest,
  GoogleChatEntityResponse,
  GoogleMessage,
  GoogleMessagePart,
} from '../../models/entities/google.chat.entity';

@Injectable()
export class GoogleRepositoryImplementationService implements ChatRepository {
  private readonly logger: Logger = new Logger(
    GoogleRepositoryImplementationService.name,
  );

  constructor(
    @Inject('ChatDatasource') private readonly chatDatasource: ChatDatasource,
  ) {}

  async chatCompletion(
    chat: ChatCompletionEntity,
    data: { [key: string]: any },
  ): Promise<ChatResponse> {
    const { google } = data;

    if (!google) {
      throw CustomError.internal('Google API data not found');
    }

    const payload: GoogleChatEntityRequest = {
      messages: [
        {
          role: GoogleRoleEnum.USER,
          parts: [
            {
              text: chat.message,
            },
          ],
        },
      ],
    } as GoogleChatEntityRequest;

    if (!payload.messages || payload.messages.length === 0) {
      throw CustomError.badRequest('Messages not found');
    }

    this.logger.log(`Chat completion with payload: ${JSON.stringify(payload)}`);

    let session: SessionChat | null =
      await this.chatDatasource.getSession(chat);

    if (!session) {
      const model: string = GoogleModelEnum.GEMINI_1_5_PRO;

      const sessionChat: SessionChat = {
        provider: chat.provider,
        session: chat.session,
        payload: {
          model: model,
          generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.5,
          },
          systemInstruction:
            'You are a helpful assistant who talks like a business man, your goal is to make a social connection with your customer to sell them a car, remember to be polite and avoid any unethical, racist or suicidal remarks.',
        },
        messages: [],
      };

      this.logger.log(
        `Session not found, creating new session: ${JSON.stringify(sessionChat)}`,
      );

      session = await this.chatDatasource.saveSession(sessionChat);
    } else {
      if (session.messages.length > 7) {
        throw CustomError.badRequest('Messages limit exceeded');
      }
    }

    this.logger.log(`Session found: ${JSON.stringify(session)}`);

    const apiKey: string = google.apiKey || '';

    this.logger.log(`Chat completion with API key: ${apiKey}`);

    const modelParams: ModelParams = {
      ...session.payload,
    } as ModelParams;

    const startChatParams: StartChatParams = {
      history: (session.messages || []).map(
        (message: SessionMessage) =>
          ({
            role: message.role,
            parts: message.content.messages,
          }) as GoogleMessage,
      ),
    } as StartChatParams;

    const lastMessage: GoogleMessage =
      payload.messages[payload.messages.length - 1];

    const prompt: string =
      lastMessage.parts[lastMessage.parts.length - 1].text || '';

    this.logger.log(
      `Data to be sent: modelParams => ${JSON.stringify(modelParams)}, startChatParams => ${JSON.stringify(startChatParams)}, lastMessage => ${JSON.stringify(lastMessage)}, prompt => ${prompt}`,
    );

    const result: GenerateContentResult = await this.processChatResponse(
      apiKey,
      prompt,
      modelParams,
      startChatParams,
    );

    this.logger.log(`Response from google: ${JSON.stringify(result)}`);

    const messageResponse: string = result.response.text() || '';

    if (messageResponse) {
      session.messages.push(
        ...[
          {
            role: GoogleRoleEnum.USER,
            content: { messages: lastMessage.parts },
          },
          {
            role: GoogleRoleEnum.MODEL,
            content: {
              messages: [
                {
                  text: messageResponse,
                },
              ],
            },
          },
        ],
      );

      const sessionUpdated = await this.chatDatasource.updateSession(session);

      this.logger.log(`Session updated: ${JSON.stringify(sessionUpdated)}`);
    }

    this.logger.log(`Message from google: ${messageResponse}`);

    const payloadResponse: GoogleChatEntityResponse = {
      usageMetadata: result.response.usageMetadata,
      candidates: result.response.candidates,
      promptFeedback: result.response.promptFeedback,
    } as GoogleChatEntityResponse;

    const billingResponse: BillingInfo =
      await this.chatDatasource.storeBillingResponse({
        context: session,
        provider: chat.provider,
        session: chat.session,
        payload: payloadResponse,
      });

    this.logger.log(`Billing response: ${JSON.stringify(billingResponse)}`);

    return {
      session: chat.session,
      payload: {
        text: messageResponse,
      } as GoogleMessagePart,
    };
  }

  async processChatResponse(
    apiKey: string,
    prompt: string,
    modelParams: ModelParams,
    startChatParams: StartChatParams,
  ): Promise<GenerateContentResult> {
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelAI: GenerativeModel = genAI.getGenerativeModel(modelParams);

    const chatSession: ChatSession = modelAI.startChat(startChatParams);

    return await chatSession.sendMessage(prompt);
  }
}
