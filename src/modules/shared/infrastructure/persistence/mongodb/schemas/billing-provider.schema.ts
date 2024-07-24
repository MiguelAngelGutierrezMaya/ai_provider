import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProviderEnum } from '../../../../models/enums/provider.enum';
import { HydratedDocument } from 'mongoose';

export type BillingProviderDocument = HydratedDocument<BillingProvider>;

@Schema()
export class BillingProvider {
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

  @Prop({
    type: Object,
    default: {},
  })
  context: { [key: string]: any };

  @Prop({
    type: Object,
    required: true,
    default: {},
  })
  data: { [key: string]: any };

  @Prop({ type: Date, required: true, default: Date.now })
  created_at: Date;

  @Prop({ type: String, required: true, default: Date.now })
  updated_at: Date;
}

export const BillingProviderSchema =
  SchemaFactory.createForClass(BillingProvider);
