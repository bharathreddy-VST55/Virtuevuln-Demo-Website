import { Module } from '@nestjs/common';
import { HttpClientModule } from '../httpclient/httpclient.module';
import { UsersModule } from '../users/users.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { LfiRfiController } from './lfi-rfi.controller';

@Module({
  imports: [UsersModule, HttpClientModule],
  controllers: [FileController, LfiRfiController],
  providers: [FileService]
})
export class FileModule {}
