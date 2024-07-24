import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Logger,
  Post,
  Res,
} from '@nestjs/common';

import { HandleErrorService } from '../../../shared/infrastructure/utils/handle_error.service';
import { HttpCodeConstants } from '../../../shared/models/constants/http-code.constants';
import { Response } from 'express';
import { ChatDto } from '../dtos/chat.dto';
import { ChatMapper } from '../mapper/chat.mapper';
import { FactoryService } from '../services/factory.service';
import { ChatRepository } from '../../models/repositories/chat.repository';
import { CustomResponseInterface } from '../../../shared/models/interfaces/custom-response.interface';
import { ConfigService } from '@nestjs/config';

@Controller('conversation')
export class ConversationController {
  private readonly logger = new Logger(ConversationController.name);
  private readonly handeErrorUtils: HandleErrorService =
    new HandleErrorService();

  constructor(
    private readonly factoryService: FactoryService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @HttpCode(HttpCodeConstants.OK)
  getConversations(
    @Res() response: Response,
  ): Response<CustomResponseInterface> | HttpException {
    try {
      return response.status(HttpCodeConstants.OK).send({
        message: 'Conversations',
        payload: {},
        status: true,
        errors: [],
      });
    } catch (error) {
      this.logger.error(error);
      return this.handeErrorUtils.handle(error);
    }
  }

  @Post('chat')
  @HttpCode(HttpCodeConstants.OK)
  async postChat(
    @Body() data: ChatDto,
    @Res() response: Response,
  ): Promise<Response<CustomResponseInterface> | HttpException> {
    try {
      const provider: ChatRepository = this.factoryService.getProvider(
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

      customResponse.payload = await provider.chatCompletion(
        ChatMapper.chatDtoToEntity(data),
        this.configService.get<{ [key: string]: any }>('ai_providers'),
      );

      return response.status(HttpCodeConstants.OK).send(customResponse);
    } catch (error) {
      this.logger.error(error);
      return this.handeErrorUtils.handle(error);
    }
  }
}
