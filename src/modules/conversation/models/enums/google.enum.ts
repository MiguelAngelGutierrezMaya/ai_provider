//
// Enum for Google models
//
export enum GoogleModelEnum {
  GEMINI_1_5_FLASH = 'gemini-1.5-flash',
  GEMINI_1_5_PRO = 'gemini-1.5-pro',
  TEXT_EMBEDDING_004 = 'text-embedding-004',
}

//
// GoogleModelType: Type for Google models
//
export type GoogleModelType =
  | GoogleModelEnum.GEMINI_1_5_FLASH
  | GoogleModelEnum.GEMINI_1_5_PRO
  | GoogleModelEnum.TEXT_EMBEDDING_004;

//
// GoogleRoleEnum: Enum for Google roles
//
export enum GoogleRoleEnum {
  USER = 'user',
  MODEL = 'model',
}

//
// GoogleRoleType: Type for Google roles
//
export type GoogleRoleType = GoogleRoleEnum.USER | GoogleRoleEnum.MODEL;
