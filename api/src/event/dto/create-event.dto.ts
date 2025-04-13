import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
export class CreateEventDto {

             @ApiProperty({
        type: String,
        description: 'The title of the event'
            })
            @IsString() 
            @IsNotEmpty()
            title: string;
            @ApiProperty({
        type: String,
        description: 'The description of the event'
    })
             @IsString() 
            @IsNotEmpty()
            description: string;
              @ApiProperty({
        type: Date,
        description: 'The start date of the event'
    })
            @IsDate()
            @IsNotEmpty()
            startDate: Date;
            @ApiProperty({
        type: String,
        description: 'The status of the event'
    })
            @IsString() 
            @IsNotEmpty()
            status: string;
             @ApiProperty({
        type: String,
        description: 'The location of the event'
    })
            @IsString() 
            @IsNotEmpty()
            location: string;
             @ApiProperty({
        type: String,
        description: 'The duration of the event'
    })
            @IsString() 
            @IsNotEmpty()
            duration: string;

     @ApiProperty({
        type: String,
        description: 'The category of the project'
    })
    @IsString() 
    @IsNotEmpty()
    eventType: string;
      @IsString() 
    @IsNotEmpty()
    user: string;
        
}


