import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateLeaveDto {
    @ApiProperty({
        type: String,
        description: 'The title of the leave'
    })
    @IsString() 
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        type: String,
        description: 'The duration of the leave'
    })
    @IsString() 
    @IsNotEmpty()
    duration: string;

    @ApiProperty({
        type: String,
        description: 'The status of the leave'
    })
    @IsString() 
    @IsNotEmpty()
    status: string;

    @ApiProperty({
        type: Date,
        description: 'The start date of the leave'
    })
    @IsDate() 
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty({
        type: Date,
        description: 'The end date of the leave'
    })
    @IsDate() 
    @IsNotEmpty()
    endDate: Date;

    @ApiProperty({
        type: String,
        description: 'The reason of the leave'
    })
    @IsString() 
    @IsNotEmpty()
    reason: string;

    @ApiProperty({
        type: String,
        description: 'The reason file of the leave (optional)'
    })
    @IsString() 
    @IsOptional()
    reasonFile: string;

    @ApiProperty({
        type: String,
        description: 'The type of the leave'
    })
    @IsString() 
    @IsNotEmpty()
    leaveType: string;
}
