//
// Enum for the different anthropic models available
//
export enum AnthropicModelEnum {
  CLAUDE_3_5_SONNET = 'claude-3-5-sonnet-20240620',
}

//
// AnthropicModelType: Type for the different anthropic models available
//
export type AnthropicModelType = AnthropicModelEnum.CLAUDE_3_5_SONNET;

//
// AnthropicRoleEnum: Enum for the different anthropic roles available
//
export enum AnthropicRoleEnum {
  USER = 'user',
  ASSISTANT = 'assistant',
}

//
// AnthropicRoleType: Type for the different anthropic roles available
//
export type AnthropicRoleType =
  | AnthropicRoleEnum.USER
  | AnthropicRoleEnum.ASSISTANT;

//
// AnthropicContentType: Enum for the different anthropic content types available
//
export enum AnthropicContentType {
  TEXT = 'text',
  IMAGE = 'image',
}

//
// AnthropicContentEnumType: Type for the different anthropic content types available
//
export type AnthropicContentEnumType =
  | AnthropicContentType.TEXT
  | AnthropicContentType.IMAGE;
