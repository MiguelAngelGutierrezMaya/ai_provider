import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Logger,
  Post,
  Res,
} from '@nestjs/common';

import { HandleErrorService } from '../../../shared/infrastructure/utils/handle_error.service';
import { HttpCodeConstants } from '../../../shared/models/constants/http-code.constants';
import { Response } from 'express';
import { ChatCompletionDto } from '../dtos/chat.dto';
import { ChatMapper } from '../mapper/chat.mapper';
import { FactoryService } from '../services/factory.service';
import { ChatRepository } from '../../models/repositories/chat.repository';
import { CustomResponseInterface } from '../../../shared/models/interfaces/custom-response.interface';
import { ConfigService } from '@nestjs/config';
import { ProviderUseCase } from '../../application/useCases/provider.use-case';
import { ChatCompletionEntity } from '../../models/entities/chat.entity';

@Controller('conversation')
export class ConversationController {
  private readonly logger = new Logger(ConversationController.name);
  private readonly handeErrorUtils: HandleErrorService =
    new HandleErrorService();

  constructor(
    private readonly factoryService: FactoryService,
    private readonly configService: ConfigService,
  ) {}

  // @Get()
  // @HttpCode(HttpCodeConstants.OK)
  // getConversations(
  //   @Res() response: Response,
  // ): Response<CustomResponseInterface> | HttpException {
  //   try {
  //     return response.status(HttpCodeConstants.OK).send({
  //       message: 'Conversations',
  //       payload: {},
  //       status: true,
  //       errors: [],
  //     });
  //   } catch (error) {
  //     this.logger.error(error);
  //     return this.handeErrorUtils.handle(error);
  //   }
  // }

  @Post('chat')
  @HttpCode(HttpCodeConstants.OK)
  async postChat(
    @Body() data: ChatCompletionDto,
    @Res() response: Response,
  ): Promise<Response<CustomResponseInterface> | HttpException> {
    try {
      const provider: ChatRepository = ProviderUseCase.getProvider(
        this.factoryService,
        data.provider,
      );

      const customResponse = {
        message: '',
        payload: {},
        status: true,
        errors: [],
      } as CustomResponseInterface;

      if (!provider) {
        customResponse.message = 'Provider not found';
        customResponse.status = false;
        return response
          .status(HttpCodeConstants.BAD_REQUEST)
          .send(customResponse);
      }

      const entity: ChatCompletionEntity = ChatMapper.chatDtoToEntity(data);
      const environmentVariables: { [key: string]: any } =
        this.configService.get<{
          [key: string]: any;
        }>('ai_providers');

      customResponse.payload = await ProviderUseCase.chatCompletion(
        provider,
        entity,
        environmentVariables,
      );

      return response.status(HttpCodeConstants.OK).send(customResponse);
    } catch (error) {
      this.logger.error(error);
      return this.handeErrorUtils.handle(error);
    }
  }
}
