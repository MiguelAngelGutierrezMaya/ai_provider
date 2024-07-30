import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProviderEnum } from '../../../shared/models/enums/provider.enum';

export class ChatCompletionDto {
  @IsNotEmpty()
  @IsEnum(ProviderEnum)
  readonly provider: string;

  @IsNotEmpty()
  @IsString()
  readonly sessionID: string;

  @IsNotEmpty()
  @IsString()
  readonly message: string;
  // payload: { [key: string]: any };
}

export class ChatCompletionImageDto extends ChatCompletionDto {
  @IsNotEmpty()
  @IsString()
  readonly image: string;
}
