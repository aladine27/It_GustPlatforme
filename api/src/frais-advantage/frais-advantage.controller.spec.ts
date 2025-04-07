import { Test, TestingModule } from '@nestjs/testing';
import { FraisAdvantageController } from './frais-advantage.controller';
import { FraisAdvantageService } from './frais-advantage.service';

describe('FraisAdvantageController', () => {
  let controller: FraisAdvantageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FraisAdvantageController],
      providers: [FraisAdvantageService],
    }).compile();

    controller = module.get<FraisAdvantageController>(FraisAdvantageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
