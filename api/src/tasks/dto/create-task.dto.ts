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
    description: "Priority of the task (high, medium, low)",
    default: "medium"
  })
  @IsString() @IsNotEmpty()
  priority: string;

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
     @ApiProperty({ type: String, description: 'The sprint associated with the task' })
    @IsString() @IsNotEmpty()
    sprint: string;
    
}
