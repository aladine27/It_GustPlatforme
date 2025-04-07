import { Test, TestingModule } from '@nestjs/testing';
import { JobOffreController } from './job-offre.controller';
import { JobOffreService } from './job-offre.service';

describe('JobOffreController', () => {
  let controller: JobOffreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobOffreController],
      providers: [JobOffreService],
    }).compile();

    controller = module.get<JobOffreController>(JobOffreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
