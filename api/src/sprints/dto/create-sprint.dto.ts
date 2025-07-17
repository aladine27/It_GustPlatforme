// src/sprints/dto/create-sprint.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';

export class CreateSprintDto {
  @ApiProperty({ type: String })
  @IsString() @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String })
  @IsString() @IsNotEmpty()
  status: string;

  @ApiProperty({ type: String, description: 'Sprint duration' })
  @IsString() @IsOptional()
  duration?: string;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ type: String, description: "Project ID" })
  @IsString() @IsNotEmpty()
  project: string;@ApiProperty({ type: String, description: "Team ID", required: false })
  @IsOptional()
  team: string; 



}
