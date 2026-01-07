import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../model/user.entity';
import { KeyCloakModule } from '../keycloak/keycloak.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MikroOrmModule.forFeature([User]),
        KeyCloakModule,
        AuthModule
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
    exports: [DashboardService],
})
export class DashboardModule { }
