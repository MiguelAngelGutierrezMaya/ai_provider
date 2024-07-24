import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProviderEnum } from '../../../../../shared/models/enums/provider.enum';
import { SessionMessage, SessionMessageSchema } from './session-message.schema';

export type SessionChatDocument = HydratedDocument<SessionChat>;

@Schema()
export class SessionChat {
  @Prop({
    type: String,
    required: true,
    enum: [
      ProviderEnum.OPENAI,
      ProviderEnum.ANTHROPIC,
      ProviderEnum.GOOGLE,
      ProviderEnum.HUGGING_FACE,
    ],
  })
  provider: string;

  @Prop({ type: String, required: true })
  session: string;

  @Prop({ type: Object, default: {} })
  payload: { [key: string]: any };

  @Prop({
    type: [SessionMessageSchema],
    default: [],
  })
  messages: Types.Array<SessionMessage>;

  @Prop({ type: Date, required: true, default: Date.now })
  created_at: Date;

  @Prop({ type: String, required: true, default: Date.now })
  updated_at: Date;
}

export const SessionChatSchema = SchemaFactory.createForClass(SessionChat);
