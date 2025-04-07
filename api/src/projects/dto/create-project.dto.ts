import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto {
    @ApiProperty()
     @IsString() 
            @IsNotEmpty()
            title: string;
              @ApiProperty()
             @IsString() 
            @IsNotEmpty()
            description: string;
              @ApiProperty()
             
            @IsNotEmpty()
            @IsString()
           
            duration: string;
              @ApiProperty()
              @IsString() 
            @IsNotEmpty()
            file: string;
              @ApiProperty()
            @IsDate()
            @IsNotEmpty()
            startDate: Date;
              @ApiProperty()
            @IsDate()
            @IsNotEmpty()
            endDate: Date;
              @ApiProperty()
              @IsString() 
            @IsNotEmpty()
            status: string;
             @ApiProperty(
              {type:String,
              description:'The category of the project'
            }
             )
              @IsString() 
            @IsNotEmpty()
            category: string;

}
