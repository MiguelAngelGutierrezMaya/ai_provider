//
// Interface for the ProviderEnum
// The ProviderEnum is an enum that contains all the available providers.
//
export enum ProviderEnum {
  OPENAI = 'openai',
  GOOGLE = 'google',
  HUGGING_FACE = 'huggingface',
  ANTHROPIC = 'anthropic',
}

// Type for the ProviderEnum
export type ProviderType =
  | ProviderEnum.OPENAI
  | ProviderEnum.GOOGLE
  | ProviderEnum.HUGGING_FACE
  | ProviderEnum.ANTHROPIC;
