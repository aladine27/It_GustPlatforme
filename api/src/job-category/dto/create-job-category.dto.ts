import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateJobCategoryDto {
        @ApiProperty()
        @IsString() 
        @IsNotEmpty()
        name: string;
        @ApiProperty(
        {type:String,
        description:'The jobcategory of the joboffre'})
        @IsString() 
        @IsNotEmpty()
        joboffre: string;


}
