import { PartialType } from '@nestjs/swagger';
import { CreateApplicationAnalysisDto } from './create-application-analysis.dto';

export class UpdateApplicationAnalysisDto extends PartialType(CreateApplicationAnalysisDto) {}
