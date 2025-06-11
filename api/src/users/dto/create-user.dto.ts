import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        type: String,
        description: 'The full name of the user'
    })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({
        type: String,
        description: 'The password of the user'
    })
    @IsString()
    password: string;

    @ApiProperty({
        type: String,
        description: 'The image of the user'
    })
    @IsString()
    @IsNotEmpty()
    image: string;

    @ApiProperty({
        type: String,
        description: 'The email address of the user'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        type: String,
        description: 'The address of the user'
    })
    @IsString()
    @IsNotEmpty()
    address: string;
    @IsString()
    @IsNotEmpty()
    domain: string;

    @ApiProperty({
        type: String,
        description: 'The role of the user'
    })
    @IsString()
    @IsNotEmpty()
    role: string;

    @ApiProperty({
        type: Number,
        description: 'The phone number of the user'
    })
    @IsNumber()
    @IsNotEmpty()
    phone: number;
}
