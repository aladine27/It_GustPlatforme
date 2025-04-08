import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateApplicationDto {
      @IsString() 
      @IsNotEmpty()
      @ApiProperty({
            type: String,
            description: 'The cv file of the application'
      })
      cvFile: string;

        @ApiProperty({
        type: String,
        description: 'The jobOffre of the application',
    })
    @IsString() 
    @IsNotEmpty()
    jobOffre: string;
      
}
