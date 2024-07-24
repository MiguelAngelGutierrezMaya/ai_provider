import {
  AnthropicContentEnumType,
  AnthropicModelType,
  AnthropicRoleType,
} from '../enums/anthropic.enum';

//
// Anthropic Message Content Source
//
interface AnthropicMessageContentSource {
  type: string;
  media_type: string;
  data: string;
}

//
// Anthropic Message Content
//
export interface AnthropicMessageContent {
  type: AnthropicContentEnumType;
  source?: AnthropicMessageContentSource;
  text?: string;
}

//
// Anthropic Message
//
export interface AnthropicMessage {
  role: AnthropicRoleType;
  content: string | AnthropicMessageContent[];
}

//
// Anthropic Chat Entity Request
//
export interface AnthropicChatEntityRequest {
  messages: AnthropicMessage[];
}

//
// Anthropic Usage
//
interface AnthropicUsage {
  input_tokens: number;
  output_tokens: number;
}

//
// Anthropic Chat Entity Response
//
export interface AnthropicChatEntityResponse {
  id: string;
  type: string;
  role: AnthropicRoleType;
  model: AnthropicModelType;
  content: AnthropicMessageContentSource[];
  stop_reason: string;
  usage: AnthropicUsage;
}
