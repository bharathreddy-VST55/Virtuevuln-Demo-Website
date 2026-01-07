import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { HttpClientModule } from '../httpclient/httpclient.module';

@Module({
  imports: [HttpClientModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: []
})
export class ChatModule {}
