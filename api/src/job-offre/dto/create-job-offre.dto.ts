import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsDate, IsNumber } from "class-validator";

export class CreateJobOffreDto {
         @ApiProperty({
        type: String,
        description: 'The title of the job offer'
    })

            @IsString() 
            @IsNotEmpty()
    
        title: string;

         @ApiProperty({
        type: String,
        description: 'The description of the job offer'
    })
            @IsString() 
            @IsNotEmpty()
        description : string;
         @ApiProperty({
        type: String,
        description: 'The requirements for the job offer'
    })
            @IsString() 
            @IsNotEmpty()
        
        requirements :  string; 
      
        
        @ApiProperty({
        type: Date,
        description: 'The posted date of the job offer'
    })
            @IsDate() 
            @IsNotEmpty()
        
        postedDate: Date; 

         @ApiProperty({
        type: Date,
        description: 'The closing date of the job offer'
    })
            @IsDate() 
            @IsNotEmpty()
    
        closingDate: Date;
        
    @ApiProperty({
        type: Number,
        description: 'The salary range of the job offer'
    })

            @IsNumber() 
            @IsNotEmpty()
        
        salaryRange: number;
           @ApiProperty({
        type: String,
        description: 'The location of the job offer'
    })
            @IsString() 
            @IsNotEmpty()
        
        location: string;
          @ApiProperty({
        type: String,
        description: 'The status of the job offer'
    })
            @IsString() 
            @IsNotEmpty()
        
        status : string;
         @ApiProperty({
        type: String,
        description: 'The recruitment process of the job offer'
    })
            @IsString() 
            @IsNotEmpty()
        
        process: string;
        
    @ApiProperty({
        type: String,
        description: 'The type of the job offer'
    })
            @IsString() 
            @IsNotEmpty()
        
        type: string;

          @IsString() 
            @IsNotEmpty()
             
    @ApiProperty({
        type: String,
        description: 'The job category of the job offer'
    })
    jobCategory: string;
     @ApiProperty({
        type: String,
        description: 'The RH associated to job offer'
    })
    @IsString() 
    @IsNotEmpty()
    user: string;

}
