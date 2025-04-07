import { Test, TestingModule } from '@nestjs/testing';
import { FraiTypeService } from './frai-type.service';

describe('FraiTypeService', () => {
  let service: FraiTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FraiTypeService],
    }).compile();

    service = module.get<FraiTypeService>(FraiTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
