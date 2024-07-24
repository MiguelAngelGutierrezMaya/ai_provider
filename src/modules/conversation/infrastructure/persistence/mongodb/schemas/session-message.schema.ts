import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionMessageDocument = HydratedDocument<SessionMessage>;

@Schema()
export class SessionMessage {
  @Prop({ type: String, required: true })
  role: string;

  @Prop({
    type: Object,
    required: true,
  })
  content: { [key: string]: any };

  @Prop({ type: Date, required: true, default: Date.now })
  created_at: Date;

  @Prop({ type: String, required: true, default: Date.now })
  updated_at: Date;
}

export const SessionMessageSchema =
  SchemaFactory.createForClass(SessionMessage);
