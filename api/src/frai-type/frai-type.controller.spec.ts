import { Test, TestingModule } from '@nestjs/testing';
import { FraiTypeController } from './frai-type.controller';
import { FraiTypeService } from './frai-type.service';

describe('FraiTypeController', () => {
  let controller: FraiTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FraiTypeController],
      providers: [FraiTypeService],
    }).compile();

    controller = module.get<FraiTypeController>(FraiTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
