import { PartialType } from '@nestjs/mapped-types';
import { CreateFraisAdvantageDto } from './create-frais-advantage.dto';

export class UpdateFraisAdvantageDto extends PartialType(CreateFraisAdvantageDto) {}
