import { GoogleRoleType } from '../enums/google.enum';

//
// GoogleMessagePart
//
export interface GoogleMessagePart {
  text: string;
}

//
// GoogleMessage
//
export interface GoogleMessage {
  role: GoogleRoleType;
  parts: GoogleMessagePart[];
}

//
// GoogleChatEntityRequest
//
export interface GoogleChatEntityRequest {
  messages: GoogleMessage[];
}

//
// GoogleCandidateContent
//
interface GoogleCandidateContent {
  parts: GoogleMessagePart[];
}

//
// GoogleCandidate
//
interface GoogleCandidate {
  content: GoogleCandidateContent;
}

//
// GoogleUsage
//
interface GoogleUsage {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
}

//
// GoogleSafetyRating
//
interface GoogleSafetyRating {
  category: string;
  probability: string;
}

//
// GooglePromptFeedback
//
interface GooglePromptFeedback {
  blockReason: string;
  safetyRatings: GoogleSafetyRating[];
  blockReasonMessage?: string;
}

//
// GoogleChatEntityResponse
//
export interface GoogleChatEntityResponse {
  candidates: GoogleCandidate[];
  usageMetadata: GoogleUsage;
  promptFeedback: GooglePromptFeedback;
}
