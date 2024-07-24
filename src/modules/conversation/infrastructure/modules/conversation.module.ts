import { Module } from '@nestjs/common';
import { ConversationController } from '../controllers/conversation.controller';
import { SharedModule } from '../../../shared/infrastructure/modules/shared.module';
import { ConfigModule } from '@nestjs/config';
import { FactoryService } from '../services/factory.service';
import { OpenaiRepositoryImplementationService } from '../repositories/openai.repository.implementation.service';
import { FetchHttpClientService } from '../../../shared/infrastructure/utils/fetch_http_client.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SessionMessage,
  SessionMessageSchema,
} from '../persistence/mongodb/schemas/session-message.schema';
import {
  SessionChat,
  SessionChatSchema,
} from '../persistence/mongodb/schemas/session-chat.schema';
import { MongoDatasourceImplementationService } from '../datasources/mongo.datasource.implementation.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: SessionChat.name,
          schema: SessionChatSchema,
        },
        {
          name: SessionMessage.name,
          schema: SessionMessageSchema,
        },
      ],
      'ai_provider',
    ),
    ConfigModule,
    // Business modules
    SharedModule,
  ],
  controllers: [ConversationController],
  providers: [
    {
      provide: 'HttpUtil',
      useClass: FetchHttpClientService,
    },
    {
      provide: 'ChatDatasource',
      useClass: MongoDatasourceImplementationService,
    },
    FactoryService,
    MongoDatasourceImplementationService,
    OpenaiRepositoryImplementationService,
  ],
})
export class ConversationModule {}
