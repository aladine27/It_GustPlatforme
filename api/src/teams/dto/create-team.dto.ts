import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: [String] })
  employeeList: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project: string;
}
