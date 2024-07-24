import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiRepositoryImplementationService } from './openai.repository.implementation.service';

describe('OpenaiRepositoryImplementationService', () => {
  let service: OpenaiRepositoryImplementationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenaiRepositoryImplementationService],
    }).compile();

    service = module.get<OpenaiRepositoryImplementationService>(OpenaiRepositoryImplementationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
