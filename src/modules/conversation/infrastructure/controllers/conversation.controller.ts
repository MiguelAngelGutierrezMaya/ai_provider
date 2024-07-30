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
import { ChatCompletionDto, ChatCompletionImageDto } from '../dtos/chat.dto';
import { ChatMapper } from '../mapper/chat.mapper';
import { ChatRepository } from '../../models/repositories/chat.repository';
import { CustomResponseInterface } from '../../../shared/models/interfaces/custom-response.interface';
import { ConfigService } from '@nestjs/config';
import { ProviderUseCase } from '../../application/useCases/provider.use-case';
import {
  ChatCompletionEntity,
  ChatCompletionImageEntity,
} from '../../models/entities/chat.entity';
import { MongoDatasourceImplementationService } from '../datasources/mongo.datasource.implementation.service';
import { FetchHttpClientService } from '../../../shared/infrastructure/utils/fetch_http_client.service';
import { FactoryService } from '../services/factory.service';

@Controller('conversation')
export class ConversationController {
  private readonly logger = new Logger(ConversationController.name);
  private readonly handeErrorUtils: HandleErrorService =
    new HandleErrorService();

  constructor(
    private readonly configService: ConfigService,
    private readonly fetchHttpClientService: FetchHttpClientService,
    private readonly mongoDatasourceImplementationService: MongoDatasourceImplementationService,
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
      const provider: ChatRepository = this.getProvider(data.provider);

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

  @Post('image')
  @HttpCode(HttpCodeConstants.OK)
  async postImage(
    @Body() data: ChatCompletionImageDto,
    @Res() response: Response,
  ): Promise<Response<CustomResponseInterface> | HttpException> {
    try {
      const provider: ChatRepository = this.getProvider(data.provider);

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

      const entity: ChatCompletionImageEntity =
        ChatMapper.chatImageDtoToEntity(data);
      const environmentVariables: { [key: string]: any } =
        this.configService.get<{
          [key: string]: any;
        }>('ai_providers');

      customResponse.payload = await ProviderUseCase.chatCompletionImage(
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

  private getProvider(provider: string): ChatRepository {
    return FactoryService.getProvider(
      provider,
      this.fetchHttpClientService,
      this.mongoDatasourceImplementationService,
    );
  }
}
