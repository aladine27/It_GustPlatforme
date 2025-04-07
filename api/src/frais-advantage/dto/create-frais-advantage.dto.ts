import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
export class CreateFraisAdvantageDto {
     @ApiProperty()
     @IsString()
     @IsNotEmpty()
     raison: string;
     @ApiProperty()
     @IsString()
     @IsNotEmpty()
     file: string;
     @ApiProperty()
     @IsString()
     @IsNotEmpty()
     status: string;
      @ApiProperty()
     @IsString() 
     @IsNotEmpty()
     fraiType: string;
            
            
}
