import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateJobCategoryDto {
    
  @ApiProperty({ type: String, description: "The name of the job category" })
  @IsString()
  @IsNotEmpty()
  name: string;

}
