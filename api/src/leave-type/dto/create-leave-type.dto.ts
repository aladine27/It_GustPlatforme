import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateLeaveTypeDto {
        @ApiProperty({
        type: String,
        description: 'The name of the leave type'
    })
       @IsString()
       @IsNotEmpty()
       name: string;
      
  @ApiProperty({
    type: String,
    description: "Limit duration (optional)",
    required: false,
  })
  @IsString()
  @IsOptional()
  limitDuration?: string;
       
}
