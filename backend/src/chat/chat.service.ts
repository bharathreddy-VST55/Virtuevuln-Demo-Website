import { Injectable, Logger } from '@nestjs/common';
import { HttpClientService } from '../httpclient/httpclient.service';
import { ChatMessage } from './api/ChatMessage';

const DEFAULT_CHAT_API_MAX_TOKENS = 200;

interface ChatRequest {
  readonly model: string;
  readonly messages: ChatMessage[];
  readonly stream: boolean;
  readonly max_tokens?: number;
  readonly temperature?: number;
}

interface ChatResponse {
  readonly choices: {
    readonly message: ChatMessage;
  }[];
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly httpClient: HttpClientService) {}

  async query(messages: ChatMessage[]): Promise<string> {
    this.logger.debug(`Chat query: ${JSON.stringify(messages)}`);

    // Check if chat API is configured (optional feature)
    if (
      !process.env.CHAT_API_URL ||
      !process.env.CHAT_API_MODEL ||
      process.env.CHAT_API_TOKEN === undefined
    ) {
      this.logger.warn('Chat API is not configured. Chat functionality is disabled.');
      return 'Chat functionality is currently unavailable. The Ollama service is not configured.';
    }

    try {
      const chatRequest: ChatRequest = {
        model: process.env.CHAT_API_MODEL,
        messages,
        max_tokens:
          +process.env.CHAT_API_MAX_TOKENS || DEFAULT_CHAT_API_MAX_TOKENS,
        stream: false,
        temperature: 0.7
      };

      const res = await this.httpClient.post<ChatResponse>(
        process.env.CHAT_API_URL,
        chatRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.CHAT_API_TOKEN}`
          },
          timeout: 300000 // 5 minutes timeout for ollama service
        }
      );

      return res?.choices?.[0]?.message?.content || 'No response from chat service.';
    } catch (error) {
      this.logger.error(`Chat API error: ${error.message}`);
      return 'Chat service is currently unavailable. Please try again later.';
    }
  }
}
