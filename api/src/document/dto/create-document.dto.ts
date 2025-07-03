import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDocumentDto {
       @ApiProperty({
        type: String,
        description: 'The title of the document'
    })
     @IsString() 
     @IsNotEmpty()
     title: string;
     @ApiProperty({
        type: Date,
        description: 'The delivery date of the document'
    })
     @IsDate() 
     @IsNotEmpty()
     @IsOptional()
     delevryDate: Date;
     @ApiProperty({
        type: Date,
        description: 'The traitement deadline of the document'
    })
     @IsDate() 
     @IsNotEmpty()
     traitementDateLimite: Date;
       @ApiProperty({
        type: String,
        description: 'The status of the document'
    })
    @IsString() 
    @IsNotEmpty()
    status: string;
     @ApiProperty({
        type: String,
        description: 'The reason of the document'
    })
    @IsString() 
    @IsNotEmpty()
    reason: string;
    
    @ApiProperty({
        type: String,
        description: 'The user associated to leave'
    })
    @IsString() 
    @IsNotEmpty()
    user: string;
    @ApiPropertyOptional({ type: String, description: 'Generated file (optional at creation)' })
    @IsOptional()
    file: string;
    @ApiProperty({ description: "ID du type de document" })
    @IsString()
    @IsNotEmpty()
    documentType: string; 



           
}
