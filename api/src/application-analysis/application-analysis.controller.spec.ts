import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationAnalysisController } from './application-analysis.controller';
import { ApplicationAnalysisService } from './application-analysis.service';

describe('ApplicationAnalysisController', () => {
  let controller: ApplicationAnalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationAnalysisController],
      providers: [ApplicationAnalysisService],
    }).compile();

    controller = module.get<ApplicationAnalysisController>(ApplicationAnalysisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
