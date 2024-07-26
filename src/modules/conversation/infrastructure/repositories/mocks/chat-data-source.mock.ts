import { ChatDatasource } from '../../../models/datasource/chat.datasource';
import {
  BillingInfo,
  ChatCompletionEntity,
  SessionChat,
} from '../../../models/entities/chat.entity';

export const sessionChat: { [key: string]: any } = {
  _id: 'id',
  messages: [],
  payload: {},
  created_at: new Date(),
  updated_at: new Date(),
};

export class ChatDataSourceMock implements ChatDatasource {
  getSession(chatEntity: ChatCompletionEntity): Promise<SessionChat | null> {
    return Promise.resolve({
      session: chatEntity.session,
      provider: chatEntity.provider,
      ...sessionChat,
    } as SessionChat);
  }

  saveSession(sessionChat: SessionChat): Promise<SessionChat> {
    return Promise.resolve(sessionChat);
  }

  storeBillingResponse(billingInfo: BillingInfo): Promise<BillingInfo> {
    return Promise.resolve(billingInfo);
  }

  updateSession(sessionChat: SessionChat): Promise<SessionChat> {
    return Promise.resolve(sessionChat);
  }
}
