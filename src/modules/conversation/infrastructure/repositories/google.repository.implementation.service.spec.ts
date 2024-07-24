import { Test, TestingModule } from '@nestjs/testing';
import { GoogleRepositoryImplementationService } from './google.repository.implementation.service';

describe('GoogleRepositoryImplementationService', () => {
  let service: GoogleRepositoryImplementationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleRepositoryImplementationService],
    }).compile();

    service = module.get<GoogleRepositoryImplementationService>(
      GoogleRepositoryImplementationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
