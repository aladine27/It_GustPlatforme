import { Test, TestingModule } from '@nestjs/testing';
import { FraisAdvantageService } from './frais-advantage.service';

describe('FraisAdvantageService', () => {
  let service: FraisAdvantageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FraisAdvantageService],
    }).compile();

    service = module.get<FraisAdvantageService>(FraisAdvantageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
