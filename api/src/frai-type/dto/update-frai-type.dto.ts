import { PartialType } from '@nestjs/mapped-types';
import { CreateFraiTypeDto } from './create-frai-type.dto';

export class UpdateFraiTypeDto extends PartialType(CreateFraiTypeDto) {}
