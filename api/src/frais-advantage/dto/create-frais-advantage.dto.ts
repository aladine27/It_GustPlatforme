import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
export class CreateFraisAdvantageDto {
     @ApiProperty({
        type: String,
        description: 'The reason of the frais advantage'
    })
     @IsString()
     @IsNotEmpty()
     raison: string;
      @ApiProperty({
        type: String,
        description: 'The file of the frais advantage'
    })
     @IsString()
     @IsNotEmpty()
     file: string;
      @ApiProperty({
        type: String,
        description: 'The status of the frais advantage'
    })
     @IsString()
     @IsNotEmpty()
     status: string;
      @ApiProperty({
        type: String,
        description: 'The type of the frais associated to the advantage'
    })
     @IsString() 
     @IsNotEmpty()
     fraiType: string;
            
            
}
