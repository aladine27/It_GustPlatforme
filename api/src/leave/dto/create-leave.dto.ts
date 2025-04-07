import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateLeaveDto {
   @ApiProperty()
     @IsString() 
        @IsNotEmpty()
        title: string;
          @IsString() 
           @ApiProperty()
        @IsNotEmpty()
        duration: string;
        @IsString() 
         @ApiProperty()
        @IsNotEmpty()
        status: string;
          @IsDate() 
           @ApiProperty()
        @IsNotEmpty()
        startDate: Date;
        
          @ApiProperty()
           @IsDate() 
        @IsNotEmpty()
        endDate: Date;
          @ApiProperty()
        
           @IsString() 
        @IsNotEmpty()
          @ApiProperty()
        reason: String;
        
          @ApiProperty()
           @IsString() 
        @IsOptional()
        reasonFile: String;}
