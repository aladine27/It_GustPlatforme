import { Test, TestingModule } from '@nestjs/testing';
import { JobOffreService } from './job-offre.service';

describe('JobOffreService', () => {
  let service: JobOffreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobOffreService],
    }).compile();

    service = module.get<JobOffreService>(JobOffreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
