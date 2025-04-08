import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
export class CreateEventTypeDto {
      @ApiProperty({
        type: String,
        description: 'The name of the event type'
    })
     @IsString() 
     @IsNotEmpty()
     name: string;
}
