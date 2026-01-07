import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';

describe('TestimonialsController', () => {
  let controller: TestimonialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestimonialsController],
      providers: [
        {
          provide: TestimonialsService,
          useValue: {}
        },
        {
          provide: AuthService,
          useValue: {}
        }
      ]
    }).compile();

    controller = module.get<TestimonialsController>(TestimonialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
