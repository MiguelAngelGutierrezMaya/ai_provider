import { BillingInfo } from '../../models/entities/chat.entity';
import { ProviderEnum } from '../../../shared/models/enums/provider.enum';

export const billingInfo: BillingInfo = {
  provider: ProviderEnum.OPENAI,
  payload: {},
  created_at: new Date(),
  updated_at: new Date(),
  session: 'session',
  context: {},
  id: 'id',
};

export class BillingProviderMock {
  constructor(private _: BillingInfo) {}

  public save = () => billingInfo;
}
