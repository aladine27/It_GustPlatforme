import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
export class CreateFraiTypeDto {
    @ApiProperty({
        type: String,
        description: 'The name of the frais type'
    })
    @IsString() 
    @IsNotEmpty()
    name: string;
     @ApiProperty({
        type: Number,
        description: 'The amount of the frais type'
    })
    @IsString() 
    @IsNotEmpty()
    amount: number;
}
