import {
  Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards,
  Query
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth("access-token")
@UseGuards(AccessTokenGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  async create(@Body() createTaskDto: CreateTaskDto, @Res() res) {
    try {
      const newTask = await this.tasksService.create(createTaskDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'Task created successfully',
        status: HttpStatus.CREATED,
        data: newTask
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      });
    }
  }

  @Get('/gettaskbyUserID/:user')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager', 'Employe')
  async findTaskByUser(@Param('user') user: string, @Res() res) {
    try {
      const userTasks = await this.tasksService.getTaskByUserID(user);
      return res.status(HttpStatus.OK).json({
        message: 'TasksByUser retrieved successfully',
        data: userTasks,
        status: HttpStatus.OK
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      });
    }
  }

  @Get()
@UseGuards(RolesGuard)
@Roles('Admin', 'Manager', 'Employe')
async findAll(@Res() res, @Query('sprint') sprint: string) {
  try {
    if (!sprint) {
      // On vérifie que le paramètre est bien fourni
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: "Missing 'sprint' parameter in query"
      });
    }
    const tasks = await this.tasksService.findAll(sprint);
    return res.status(HttpStatus.OK).json({
      message: 'Tasks retrieved successfully',
      data: tasks,
      status: HttpStatus.OK
    });
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      data: null,
      status: HttpStatus.BAD_REQUEST,
      message: error.message
    });
  }
}


  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager', 'Employe')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const task = await this.tasksService.findOne(id);
      return res.status(HttpStatus.OK).json({
        message: 'Task retrieved successfully',
        data: task,
        status: HttpStatus.OK
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      });
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Res() res) {
    try {
      const task = await this.tasksService.update(id, updateTaskDto);
      return res.status(HttpStatus.OK).json({
        message: 'Task updated successfully',
        data: task,
        status: HttpStatus.OK
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      });
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const task = await this.tasksService.remove(id);
      return res.status(HttpStatus.OK).json({
        message: 'Task deleted successfully',
        data: task,
        status: HttpStatus.OK
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      });
    }
  }
}
