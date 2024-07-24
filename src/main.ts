import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import configuration from './infrastructure/config/configuration';
import { CustomResponseInterface } from './modules/shared/models/interfaces/custom-response.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const customResponse: CustomResponseInterface = {
          message: 'Bad request',
          status: false,
          errors: errors,
          payload: {},
        } as CustomResponseInterface;

        return new BadRequestException(customResponse);
      },
      stopAtFirstError: true,
    }),
  );
  const confVars = configuration();

  app.enableCors();
  await app.listen(confVars.port);
}

bootstrap();
