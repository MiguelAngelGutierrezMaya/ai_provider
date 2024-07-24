import { Test, TestingModule } from '@nestjs/testing';
import { AnthropicRepositoryImplementationService } from './anthropic.repository.implementation.service';

describe('AnthropicRepositoryImplementationService', () => {
  let service: AnthropicRepositoryImplementationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnthropicRepositoryImplementationService],
    }).compile();

    service = module.get<AnthropicRepositoryImplementationService>(AnthropicRepositoryImplementationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
