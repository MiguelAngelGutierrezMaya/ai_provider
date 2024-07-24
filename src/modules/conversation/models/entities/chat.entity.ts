import { ProviderType } from '../../../shared/models/enums/provider.enum';
import {
  OpenaiChatEntityRequest,
  OpenaiChatEntityResponse,
  OpenaiMessage,
} from './openai.chat.entity';
import {
  AnthropicChatEntityRequest,
  AnthropicChatEntityResponse,
  AnthropicMessageContent,
} from './anthropic.chat.entity';

//
// ChatEntity
//
export interface ChatEntity {
  provider: ProviderType;
  session: string;
  payload:
    | OpenaiChatEntityRequest
    | AnthropicChatEntityRequest
    | { [key: string]: any };
}

//
// ChatResponse
//
export interface ChatResponse {
  session: string;
  payload: OpenaiMessage | AnthropicMessageContent | { [key: string]: any };
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
  content: string | { [key: string]: any } | { [key: string]: any }[];
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
