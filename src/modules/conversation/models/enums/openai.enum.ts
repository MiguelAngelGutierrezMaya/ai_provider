//
// OpenaiModelEnum: Enum for OpenAI models
//
export enum OpenaiModelEnum {
  GPT4 = 'gpt-4',
  GPT4O = 'gpt-4o',
}

//
// OpenaiModelType: Type for OpenAI models
//
export type OpenaiModelType = OpenaiModelEnum.GPT4 | OpenaiModelEnum.GPT4O;

//
// OpenaiRoleEnum: Enum for OpenAI roles
//
export enum OpenaiRoleEnum {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

//
// OpenaiRoleType: Type for OpenAI roles
//
export type OpenaiRoleType =
  | OpenaiRoleEnum.USER
  | OpenaiRoleEnum.ASSISTANT
  | OpenaiRoleEnum.SYSTEM;

//
// OpenaiContentEnum: Enum for OpenAI content types
//
export enum OpenaiContentEnum {
  TEXT = 'text',
  IMAGE_URL = 'image_url',
}

//
// OpenaiContentType: Type for OpenAI content types
//
export type OpenaiContentType =
  | OpenaiContentEnum.TEXT
  | OpenaiContentEnum.IMAGE_URL;
