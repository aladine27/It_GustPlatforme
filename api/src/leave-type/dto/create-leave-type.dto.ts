import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateLeaveTypeDto {
        @ApiProperty({
        type: String,
        description: 'The name of the leave type'
    })
       @IsString()
       @IsNotEmpty()
       name: string;
}
