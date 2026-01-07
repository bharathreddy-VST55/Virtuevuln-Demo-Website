export interface ChatMessage {
  readonly role: 'user' | 'assistant' | 'system';
  readonly content: string;
}
