import {
  OpenaiContentEnum,
  OpenaiRoleType,
} from '../enums/openai.enum';

//
// OpenaiImage
//
interface OpenaiImage {
  url: string;
}

//
// OpenaiMessageContent
//
interface OpenaiMessageContent {
  type: OpenaiContentEnum;
  text?: string;
  image_url?: OpenaiImage;
}

//
// OpenaiMessage
//
export interface OpenaiMessage {
  role: OpenaiRoleType;
  content: string | OpenaiMessageContent[];
}

//
// OpenaiChatEntityRequest
//
export interface OpenaiChatEntityRequest {
  messages: OpenaiMessage[];
}

//
// Openai Usage
//
interface OpenaiUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

//
// OpenaiChoice
//
interface OpenaiChoice {
  index: number;
  message: OpenaiMessage;
  finish_reason: string;
}

//
// OpenaiChatEntityResponse
//
export interface OpenaiChatEntityResponse {
  id: string;
  object: string;
  model: string;
  system_fingerprint: string;
  choices: OpenaiChoice[];
  usage: OpenaiUsage;
}
