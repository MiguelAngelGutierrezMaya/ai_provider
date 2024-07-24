import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProviderEnum } from '../../../shared/models/enums/provider.enum';

export class ChatDto {
  @IsNotEmpty()
  @IsEnum(ProviderEnum)
  readonly provider: string;

  @IsNotEmpty()
  @IsString()
  readonly sessionID: string;

  @IsNotEmpty()
  payload: { [key: string]: any };
}
