import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { KeyCloakService } from '../keycloak/keycloak.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {}
        },
        {
          provide: KeyCloakService,
          useValue: {}
        },
        {
          provide: AuthService,
          useValue: {}
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
