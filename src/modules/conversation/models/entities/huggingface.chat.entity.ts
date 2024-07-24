import { HugginFaceRoleType } from '../enums/hugginface.enum';

//
// HuggingFaceMessage
//
export interface HugginFaceMessage {
  role: HugginFaceRoleType;
  content: string;
}

//
// HuggingfaceChatEntityRequest
//
export interface HuggingFaceChatEntityRequest {
  messages: HugginFaceMessage[];
}
