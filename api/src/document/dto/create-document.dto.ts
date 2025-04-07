import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateDocumentDto {
     @ApiProperty()
     @IsString() 
            @IsNotEmpty()
            title: string;
             @ApiProperty()
             @IsDate() 
            @IsNotEmpty()
            delevryDate: Date;
             @ApiProperty()
             @IsDate() 
            @IsNotEmpty()
            traitementDateLimite: Date;
             @ApiProperty()
             @IsDate() 
            @IsNotEmpty()
            status: string;
             @ApiProperty()
            @IsString() 
            @IsNotEmpty()
            reason: string;



           
}
