import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
export class CreateEventDto {

             @ApiProperty()
            @IsString() 
            @IsNotEmpty()
            title: string;
             @ApiProperty()
             @IsString() 
            @IsNotEmpty()
            description: string;
             @ApiProperty()
            @IsDate()
            @IsNotEmpty()
            startDate: Date;
           @ApiProperty()
            @IsString() 
            @IsNotEmpty()
            status: string;
             @ApiProperty()
            @IsString() 
            @IsNotEmpty()
            location: string;
        
        }


