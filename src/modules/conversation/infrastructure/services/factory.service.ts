import { Inject, Injectable } from '@nestjs/common';
import { ChatRepository } from '../../models/repositories/chat.repository';
import {
  ProviderEnum,
  ProviderType,
} from '../../../shared/models/enums/provider.enum';
import { OpenaiRepositoryImplementationService } from '../repositories/openai.repository.implementation.service';
import { FetchHttpClientService } from '../../../shared/infrastructure/utils/fetch_http_client.service';
import { AnthropicRepositoryImplementationService } from '../repositories/anthropic.repository.implementation.service';
import { MongoDatasourceImplementationService } from '../datasources/mongo.datasource.implementation.service';

@Injectable()
export class FactoryService {
  constructor(
    private readonly fetchHttpClientService: FetchHttpClientService,
    private readonly mongoDatasourceImplementationService: MongoDatasourceImplementationService,
  ) {}

  public getProvider(provider: string): ChatRepository | null {
    const providers: { [key in ProviderType]: ChatRepository | null } = {
      [ProviderEnum.OPENAI]: new OpenaiRepositoryImplementationService(
        this.fetchHttpClientService,
        this.mongoDatasourceImplementationService,
      ),
      [ProviderEnum.GOOGLE]: null,
      [ProviderEnum.HUGGING_FACE]: null,
      [ProviderEnum.ANTHROPIC]: new AnthropicRepositoryImplementationService(
        this.fetchHttpClientService,
        this.mongoDatasourceImplementationService,
      ),
    };

    return providers[provider as ProviderType];
  }
}