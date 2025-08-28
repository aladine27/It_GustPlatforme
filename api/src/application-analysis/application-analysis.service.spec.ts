import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationAnalysisService } from './application-analysis.service';

describe('ApplicationAnalysisService', () => {
  let service: ApplicationAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationAnalysisService],
    }).compile();

    service = module.get<ApplicationAnalysisService>(ApplicationAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
