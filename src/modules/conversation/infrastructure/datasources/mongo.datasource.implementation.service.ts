import { Injectable, Logger } from '@nestjs/common';
import { ChatDatasource } from '../../models/datasource/chat.datasource';
import { SessionChat as SessionChatMongo } from '../persistence/mongodb/schemas/session-chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BillingInfo,
  ChatCompletionEntity,
  SessionChat,
} from '../../models/entities/chat.entity';
import { ChatMapper } from '../mapper/chat.mapper';
import { BillingProvider } from '../../../shared/infrastructure/persistence/mongodb/schemas/billing-provider.schema';

@Injectable()
export class MongoDatasourceImplementationService implements ChatDatasource {
  private readonly logger = new Logger(
    MongoDatasourceImplementationService.name,
  );

  constructor(
    @InjectModel(SessionChatMongo.name, 'ai_provider')
    private readonly sessionChatModel: Model<SessionChatMongo>,
    @InjectModel(BillingProvider.name, 'ai_provider')
    private readonly billingProviderModel: Model<BillingProvider>,
  ) {}

  async getSession(
    chatEntity: ChatCompletionEntity,
  ): Promise<SessionChat | null> {
    const response = await this.sessionChatModel
      .findOne({
        provider: chatEntity.provider as string,
        session: chatEntity.session,
      })
      .exec();

    this.logger.log(`Session found: ${JSON.stringify(response)}`);

    if (!response) {
      return null;
    }

    return ChatMapper.sessionSchemaToEntity(response);
  }

  async saveSession(sessionChat: SessionChat): Promise<SessionChat> {
    const sessionChatModel = new this.sessionChatModel(sessionChat);
    const response = await sessionChatModel.save();
    this.logger.log(`Session saved: ${JSON.stringify(response)}`);
    return ChatMapper.sessionSchemaToEntity(response);
  }

  async updateSession(sessionChat: SessionChat): Promise<SessionChat> {
    const response = await this.sessionChatModel
      .findOneAndUpdate(
        {
          _id: sessionChat.id,
          provider: sessionChat.provider as string,
          session: sessionChat.session,
        },
        {
          $set: {
            messages: sessionChat.messages,
            updated_at: new Date(),
          },
        },
        { new: true },
      )
      .exec();

    this.logger.log(`Session updated: ${JSON.stringify(response)}`);

    return ChatMapper.sessionSchemaToEntity(response);
  }

  async storeBillingResponse(billingInfo: BillingInfo): Promise<BillingInfo> {
    const billingProviderModel = new this.billingProviderModel({
      provider: billingInfo.provider,
      context: billingInfo.context,
      session: billingInfo.session,
      data: billingInfo.payload,
    });
    const response = await billingProviderModel.save();
    this.logger.log(`Billing response saved: ${JSON.stringify(response)}`);
    return ChatMapper.billingSchemaToEntity(response);
  }
}
