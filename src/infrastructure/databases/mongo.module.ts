import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigType } from '@nestjs/config';
import databaseConfig from '../config/database.config';
import mongoose, { Mongoose } from 'mongoose';

// @Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      connectionName: 'ai_provider',
      useFactory: (configService: ConfigType<typeof databaseConfig>) => {
        const { connection, user, password, host, port, dbName } =
          configService.mongo;
        return {
          uri: `${connection}://${host}:${port}`,
          user,
          pass: password,
          dbName,
        };
      },
      inject: [databaseConfig.KEY],
    }),
  ],
  providers: [
    {
      provide: 'MONGO',
      useFactory: async (configService: ConfigType<typeof databaseConfig>) => {
        const { connection, user, password, host, port, dbName } =
          configService.mongo;
        const uri = `${connection}://${user}:${password}@${host}:${port}`;
        const response: Mongoose = await mongoose.connect(uri, {
          dbName,
        });
        return response;
      },
      inject: [databaseConfig.KEY],
    },
  ],
  exports: ['MONGO', MongooseModule],
})
export class MongoModule {}
