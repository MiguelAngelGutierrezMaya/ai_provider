//
// Enum for HugginFace models
//
export enum HugginFaceModelEnum {
  MISTRAL_7B_INSTRUCT_V_0_2 = 'mistralai/Mistral-7B-Instruct-v0.2',
}

//
// HugginFaceModelType: Type for HugginFace models
//
export type HugginFaceModelType = HugginFaceModelEnum.MISTRAL_7B_INSTRUCT_V_0_2;

//
// HugginFaceRoleEnum: Enum for HugginFace roles
//
export enum HugginFaceRoleEnum {
  USER = 'user',
  ASSISTANT = 'assistant',
}

//
// HugginFaceRoleType: Type for HugginFace roles
//
export type HugginFaceRoleType =
  | HugginFaceRoleEnum.USER
  | HugginFaceRoleEnum.ASSISTANT;
