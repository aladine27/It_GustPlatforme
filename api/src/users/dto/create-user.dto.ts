import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
   @ApiProperty()
   @IsString()
   @IsNotEmpty()
   fullName: string;     
   @ApiProperty()
   @IsString()
   @IsNotEmpty()
   password: string;
   @ApiProperty()
   @IsString()
   @IsNotEmpty()
   image: string;
   @ApiProperty() 
   @IsEmail()
   @IsNotEmpty()
   email: string;
   @ApiProperty()
   @IsString()
   @IsNotEmpty()
   address: string;
   @IsString()
   @ApiProperty()
   @IsNotEmpty()
   role: string;
   @IsNumber()
   @ApiProperty()
   @IsNotEmpty()
   phone: number;

    
}
