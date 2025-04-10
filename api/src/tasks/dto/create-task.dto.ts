import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {
    @ApiProperty({
        type: String,
        description: 'The title of the task'
    })
    @IsString() 
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        type: String,
        description: 'The description of the task'
    })
    @IsString() 
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        type: String,
        description: 'The duration of the task'
    })
    @IsNotEmpty()
    @IsString()      
    duration: string;

    @ApiProperty({
        type: Date,
        description: 'The start date of the task'
    })     
    @IsDate()
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty({
        type: Date,
        description: 'The end date of the task'
    })
    @IsDate()
    @IsNotEmpty()
    endDate: Date;

    @ApiProperty({
        type: String,
        description: 'The status of the task'
    })
    @IsString() 
    @IsNotEmpty()
    status: string;

    @ApiProperty({
        type: String,
        description: 'The project associated with the task'
    })
    @IsString() 
    @IsNotEmpty()
    project: string;
     @ApiProperty({
        type: String,
        description: 'The user associated with the task'
    })
    @IsString() 
    @IsNotEmpty()
    user: string;
}
