import { Test, TestingModule } from '@nestjs/testing';
import { MongoDatasourceImplementationService } from './mongo.datasource.implementation.service';

describe('MongoDatasourceImplementationService', () => {
  let service: MongoDatasourceImplementationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoDatasourceImplementationService],
    }).compile();

    service = module.get<MongoDatasourceImplementationService>(
      MongoDatasourceImplementationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
