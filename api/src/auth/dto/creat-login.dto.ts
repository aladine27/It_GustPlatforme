import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class createLoginDto {
    @ApiProperty({
        type:String,
        description:"this field is required"
    }
    )
    @IsString()
    @IsNotEmpty()
  email: string;
    @ApiProperty({
        type:String,
        description:"this field is required"
    }
    )
    @IsString()
    @IsNotEmpty()
  password: string;
}