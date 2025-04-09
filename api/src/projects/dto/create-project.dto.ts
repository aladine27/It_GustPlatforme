import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto {
    @ApiProperty({
        type: String,
        description: 'The title of the project'
    })
    @IsString() 
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        type: String,
        description: 'The description of the project'
    })
    @IsString() 
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        type: String,
        description: 'The duration of the project'
    })
    @IsNotEmpty()
    @IsString()
    duration: string;

    @ApiProperty({
        type: String,
        description: 'The file associated with the project'
    })
    @IsString() 
    @IsNotEmpty()
    file: string;

    @ApiProperty({
        type: String,
        description: 'The start date of the project'
    })
    @IsDate()
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty({
        type: Date,
        description: 'The end date of the project'
    })
    @IsDate()
    @IsNotEmpty()
    endDate: Date;

    @ApiProperty({
        type: Date,
        description: 'The status of the project'
    })
    @IsString() 
    @IsNotEmpty()
    status: string;

    @ApiProperty({
        type: String,
        description: 'The category of the project'
    })
    @IsString() 
    @IsNotEmpty()
    category: string;
     @ApiProperty({
        type: String,
        description: 'The user associated to project'
    })
    @IsString() 
    @IsNotEmpty()
    user: string;

}
