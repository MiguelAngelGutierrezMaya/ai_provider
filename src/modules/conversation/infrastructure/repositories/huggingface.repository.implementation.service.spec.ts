import { Test, TestingModule } from '@nestjs/testing';
import { HuggingfaceRepositoryImplementationService } from './huggingface.repository.implementation.service';

describe('HuggingfaceRepositoryImplementationService', () => {
  let service: HuggingfaceRepositoryImplementationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HuggingfaceRepositoryImplementationService],
    }).compile();

    service = module.get<HuggingfaceRepositoryImplementationService>(
      HuggingfaceRepositoryImplementationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
