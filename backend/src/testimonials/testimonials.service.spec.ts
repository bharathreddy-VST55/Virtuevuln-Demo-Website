import { EntityManager } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Testimonial } from './api/testimonial.model';
import { TestimonialsService } from './testimonials.service';

describe('TestimonialsService', () => {
  let service: TestimonialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestimonialsService,
        {
          provide: EntityManager,
          useValue: {}
        },
        {
          provide: getRepositoryToken(Testimonial),
          useValue: {}
        }
      ]
    }).compile();

    service = module.get<TestimonialsService>(TestimonialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
