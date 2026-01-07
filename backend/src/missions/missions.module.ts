import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrmModule } from '../orm/orm.module';
import { UsersModule } from '../users/users.module';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';

@Module({
  imports: [OrmModule, AuthModule, UsersModule],
  controllers: [MissionsController],
  providers: [MissionsService],
  exports: [MissionsService]
})
export class MissionsModule {}

