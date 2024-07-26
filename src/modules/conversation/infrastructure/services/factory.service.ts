import { ChatRepository } from '../../models/repositories/chat.repository';
import {
  ProviderEnum,
  ProviderType,
} from '../../../shared/models/enums/provider.enum';
import { OpenaiRepositoryImplementationService } from '../repositories/openai.repository.implementation.service';
import { AnthropicRepositoryImplementationService } from '../repositories/anthropic.repository.implementation.service';
import { GoogleRepositoryImplementationService } from '../repositories/google.repository.implementation.service';
import { HuggingfaceRepositoryImplementationService } from '../repositories/huggingface.repository.implementation.service';
import { HttpUtil } from '../../../shared/models/utils/http.util';
import { ChatDatasource } from '../../models/datasource/chat.datasource';

export class FactoryService {
  static getProvider(
    provider: string,
    httpUtil: HttpUtil,
    chatDatasource: ChatDatasource,
  ): ChatRepository | null {
    const providers: { [key in ProviderType]: ChatRepository | null } = {
      [ProviderEnum.OPENAI]: new OpenaiRepositoryImplementationService(
        httpUtil,
        chatDatasource,
      ),
      [ProviderEnum.GOOGLE]: new GoogleRepositoryImplementationService(
        chatDatasource,
      ),
      [ProviderEnum.HUGGING_FACE]:
        new HuggingfaceRepositoryImplementationService(chatDatasource),
      [ProviderEnum.ANTHROPIC]: new AnthropicRepositoryImplementationService(
        httpUtil,
        chatDatasource,
      ),
    };

    return providers[provider as ProviderType];
  }
}
