import { EntityManager } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpClientService } from '../httpclient/httpclient.service';
import { KeyCloakService } from '../keycloak/keycloak.service';
import { AuthService } from './auth.service';

jest.mock('fs', () => ({
  readFileSync: jest.fn((path: string) =>
    path.toLowerCase().includes('json') ? '{}' : 'mocked-key-content'
  )
}));

jest.mock('@mikro-orm/core', () => ({
  EntityManager: jest.fn().mockImplementation(() => ({
    // Add any methods that your AuthService might use
    find: jest.fn(),
    findOne: jest.fn(),
    persist: jest.fn(),
    flush: jest.fn()
  }))
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: EntityManager,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          useFactory: () => new (EntityManager as any)()
        },
        {
          provide: KeyCloakService,
          useValue: {}
        },
        {
          provide: HttpClientService,
          useValue: {}
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => key
          }
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
