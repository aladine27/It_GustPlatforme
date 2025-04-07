import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsDate, IsNumber } from "class-validator";

export class CreateJobOffreDto {
     @ApiProperty()
            @IsString() 
            @IsNotEmpty()
    
        title: string;
         @ApiProperty()
            @IsString() 
            @IsNotEmpty()
        description : string;
         @ApiProperty()
            @IsString() 
            @IsNotEmpty()
        
        requirements :  string; 
         @ApiProperty()
            @IsEmail() 
            @IsNotEmpty()
        
        emailContact: string;
         @ApiProperty()
            @IsDate() 
            @IsNotEmpty()
        
        postedDate: Date; 

         @ApiProperty()
            @IsDate() 
            @IsNotEmpty()
    
        closingDate: Date;
         @ApiProperty()
            @IsNumber() 
            @IsNotEmpty()
        
        salaryRange: number;
         @ApiProperty()
            @IsString() 
            @IsNotEmpty()
        
        location: string;
         @ApiProperty()
            @IsString() 
            @IsNotEmpty()
        
        status : string;
         @ApiProperty()
            @IsString() 
            @IsNotEmpty()
        
        process: string;
         @ApiProperty()
            @IsString() 
            @IsNotEmpty()
        
        type: string;
}
