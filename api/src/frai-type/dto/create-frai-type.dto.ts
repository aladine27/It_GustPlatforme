import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
export class CreateFraiTypeDto {
      @ApiProperty()
    @IsString() 
        @IsNotEmpty()
        name: string;
        @ApiProperty()
    @IsString() 
        @IsNotEmpty()
        amount: number;
}
