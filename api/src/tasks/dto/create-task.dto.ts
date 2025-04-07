import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto { 
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
          
          
          }
