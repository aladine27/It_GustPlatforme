import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateJobCategoryDto {
        @ApiProperty({
        type: String,
        description: 'The name of the job category'
    })
        @IsString() 
        @IsNotEmpty()
        name: string;
        @ApiProperty(
        {type:String,
        description:'The jobcategory of the joboffre'})
         @ApiProperty({
        type: String,
        description: 'The name of the job offre'
    })
        @IsString() 
        @IsNotEmpty()
        joboffre: string;


}
