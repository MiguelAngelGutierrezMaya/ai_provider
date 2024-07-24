import { Test, TestingModule } from '@nestjs/testing';
import { FetchHttpClientService } from './fetch_http_client.service';

describe('FetchHttpClientService', () => {
  let service: FetchHttpClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchHttpClientService],
    }).compile();

    service = module.get<FetchHttpClientService>(FetchHttpClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
