import { registerAs } from '@nestjs/config';

export default registerAs('databases', () => ({
  mongo: {
    dbName: process.env.MONGO_DB,
    user: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    port: parseInt(process.env.MONGO_PORT, 10),
    host: process.env.MONGO_HOST,
    connection: process.env.MONGO_CONNECTION,
  },
}));
