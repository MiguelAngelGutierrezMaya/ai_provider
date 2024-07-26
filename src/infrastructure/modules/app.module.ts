import { Module } from '@nestjs/common';

//
// Controllers
//
// import { AppController } from '../controllers/app.controller';

//
// Services
//
// import { AppService } from '../services/app.service';

//
// Business modules
//
import { ConversationModule } from '../../modules/conversation/infrastructure/modules/conversation.module';

//
// Configurations
//
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import databaseConfig from '../config/database.config';

//
// Third-party modules
//
import { MongoModule } from '../databases/mongo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, databaseConfig],
      isGlobal: true,
    }),
    MongoModule,

    // Business modules
    ConversationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
