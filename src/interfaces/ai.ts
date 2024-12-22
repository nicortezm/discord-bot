export interface GrokResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
  system_fingerprint: string;
}

export interface Choice {
  index: number;
  message: Message;
  finish_reason: string;
}

export interface Message {
  role: string;
  content: string;
  refusal: null;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  prompt_tokens_details: PromptTokensDetails;
}

export interface PromptTokensDetails {
  text_tokens: number;
  audio_tokens: number;
  image_tokens: number;
  cached_tokens: number;
}
