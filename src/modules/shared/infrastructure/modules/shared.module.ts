import { Module } from '@nestjs/common';
import { HandleErrorService } from '../utils/handle_error.service';
import { FetchHttpClientService } from '../utils/fetch_http_client.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BillingProvider,
  BillingProviderSchema,
} from '../persistence/mongodb/schemas/billing-provider.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: BillingProvider.name,
          schema: BillingProviderSchema,
        },
      ],
      'ai_provider',
    ),
  ],
  providers: [HandleErrorService, FetchHttpClientService],
  exports: [HandleErrorService, FetchHttpClientService, MongooseModule],
})
export class SharedModule {}
