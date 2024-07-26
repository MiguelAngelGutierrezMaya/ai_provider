import { ProviderType } from '../../../shared/models/enums/provider.enum';
import { OpenaiChatEntityResponse, OpenaiMessage } from './openai.chat.entity';
import {
  AnthropicChatEntityResponse,
  AnthropicMessageContent,
} from './anthropic.chat.entity';
import {
  GoogleChatEntityResponse,
  GoogleMessagePart,
} from './google.chat.entity';
import { HugginFaceMessage } from './huggingface.chat.entity';

//
// ChatEntity
//
export interface ChatCompletionEntity {
  provider: ProviderType;
  session: string;
  message: string;
}

//
// ChatResponse
//
export interface ChatResponse {
  session: string;
  payload:
    | OpenaiMessage
    | AnthropicMessageContent
    | GoogleMessagePart
    | HugginFaceMessage;
}

//
// BillingInfo
//
export interface BillingInfo {
  id?: string;
  provider: ProviderType;
  session: string;
  context: { [key: string]: any };
  payload:
    | OpenaiChatEntityResponse
    | AnthropicChatEntityResponse
    | GoogleChatEntityResponse
    | { [key: string]: any };
  created_at?: Date;
  updated_at?: Date;
}

//
// SessionMessage
//
export interface SessionMessage {
  id?: string;
  role: string;
  content: { [key: string]: any };
  created_at?: Date;
  updated_at?: Date;
}

//
// SessionChat
//
export interface SessionChat {
  id?: string;
  provider: ProviderType;
  session: string;
  payload: { [key: string]: any };
  messages: SessionMessage[];
  created_at?: Date;
  updated_at?: Date;
}
