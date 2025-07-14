import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto,@Res() res) {
    try {
      const newTask = await this.tasksService.create(createTaskDto);
      return res.status(HttpStatus.CREATED).json({message: 'Task created successfully', status: HttpStatus.CREATED, data: newTask}); 
      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null,
         status: HttpStatus.BAD_REQUEST,
         message: error.message});
      
    }
    
  }
  @Get('/gettaskbyUserID/:user')
  async findTaskByUser(@Param('user') user: string, @Res() res) {
    try {
      const userTasks= await this.tasksService.getTaskByUserID(user);
      return res.status(HttpStatus.OK).json(
        {message: 'TasksByUser retrieved successfully',
        data:userTasks,
        status: HttpStatus.OK
        });
      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      const tasks = await this.tasksService.findAll();
      return res.status(HttpStatus.OK).json({message: 'Tasks retrieved successfully',data:tasks, status: HttpStatus.OK
    });
      
    } catch (error) {
       return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} 
      
    );
      
    }
    
  }

  @Get(':id')
  async findOne(@Param('id') id: string,@Res() res) {
    try {
      const task = await this.tasksService.findOne(id);
      return res.status(HttpStatus.OK).json({message: 'Task retrieved successfully',data:task, status: HttpStatus.OK
    });
      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Res() res) {
  try {
    const task = await this.tasksService.update(id, updateTaskDto);
    return res.status(HttpStatus.OK).json({message: 'Task updated successfully',data:task, status: HttpStatus.OK  }); 
    
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      data:null,  
      status: HttpStatus.BAD_REQUEST,
      message: error.message} );
    
  }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const task = await this.tasksService.remove(id);
      return res.status(HttpStatus.OK).json({message: 'Task deleted successfully',data:task, status: HttpStatus.OK  }); 
      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ data:null, status: HttpStatus.BAD_REQUEST, message: error.message} );  
      
    }
  }
  

}
