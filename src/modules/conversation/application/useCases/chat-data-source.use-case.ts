import { ChatDatasource } from '../../models/datasource/chat.datasource';
import {
  BillingInfo,
  ChatCompletionEntity,
  SessionChat,
} from '../../models/entities/chat.entity';

export class ChatDataSourceUseCase {
  //
  // This class is a use case for the ChatDataSource
  // It is used to get the session from the ChatDataSource
  // - dataSource: ChatDatasource
  // - chatCompletionEntity: ChatCompletionEntity
  // - returns: Promise<SessionChat | null>
  //
  static async getSessions(
    dataSource: ChatDatasource,
    chatCompletionEntity: ChatCompletionEntity,
  ): Promise<SessionChat | null> {
    return await dataSource.getSession(chatCompletionEntity);
  }

  //
  // This class is a use case for the ChatDataSource
  // It is used to save the session to the ChatDataSource
  // - dataSource: ChatDatasource
  // - sessionChat: SessionChat
  // - returns: Promise<SessionChat>
  //
  static async saveSession(
    dataSource: ChatDatasource,
    sessionChat: SessionChat,
  ): Promise<SessionChat> {
    return await dataSource.saveSession(sessionChat);
  }

  //
  // This class is a use case for the ChatDataSource
  // It is used to update the session to the ChatDataSource
  // - dataSource: ChatDatasource
  // - sessionChat: SessionChat
  // - returns: Promise<SessionChat>
  //
  static async updateSession(
    dataSource: ChatDatasource,
    sessionChat: SessionChat,
  ): Promise<SessionChat> {
    return await dataSource.updateSession(sessionChat);
  }

  //
  // This class is a use case for the ChatDataSource
  // It is used to store the billing response to the ChatDataSource
  // - dataSource: ChatDatasource
  // - billingInfo: BillingInfo
  // - returns: Promise<BillingInfo>
  //
  static async storeBillingResponse(
    dataSource: ChatDatasource,
    billingInfo: BillingInfo,
  ): Promise<BillingInfo> {
    return await dataSource.storeBillingResponse(billingInfo);
  }
}
