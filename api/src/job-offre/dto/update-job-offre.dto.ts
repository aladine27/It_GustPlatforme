import { PartialType } from '@nestjs/mapped-types';
import { CreateJobOffreDto } from './create-job-offre.dto';

export class UpdateJobOffreDto extends PartialType(CreateJobOffreDto) {}
