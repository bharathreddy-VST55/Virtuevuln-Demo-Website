import { ApiProperty } from '@nestjs/swagger';

export class ChatMessage {
  @ApiProperty({
    description:
      'The role of the messages author. Choice between: system, user, or assistant',
    enum: ['user', 'assistant', 'system']
  })
  role: 'user' | 'assistant' | 'system';

  @ApiProperty({
    description: 'The contents of the message'
  })
  content: string;
}
