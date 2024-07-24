import { Test, TestingModule } from '@nestjs/testing';
import { HandleErrorService } from './handle_error.service';

describe('HandleErrorService', () => {
  let service: HandleErrorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandleErrorService],
    }).compile();

    service = module.get<HandleErrorService>(HandleErrorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
