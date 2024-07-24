import {
  BillingInfo,
  ChatCompletionEntity,
  SessionChat,
} from '../entities/chat.entity';

export abstract class ChatDatasource {
  abstract getSession(
    chatEntity: ChatCompletionEntity,
  ): Promise<SessionChat | null>;

  abstract saveSession(sessionChat: SessionChat): Promise<SessionChat>;

  abstract updateSession(sessionChat: SessionChat): Promise<SessionChat>;

  abstract storeBillingResponse(billingInfo: BillingInfo): Promise<BillingInfo>;
}
