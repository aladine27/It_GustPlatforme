import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ITask } from './interfaces/task.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProject } from 'src/projects/interfaces/project.interface';

@Injectable()
export class TasksService {
  constructor(@InjectModel('projects') private projectModel: Model<IProject>,
  @InjectModel('tasks') private taskModel: Model<ITask>) {}


 async create(createTaskDto: CreateTaskDto):Promise<ITask> {
    const newTask = new  this.taskModel(createTaskDto);
    await this.projectModel.updateOne({_id:createTaskDto.project},{$push:{tasks:newTask._id}})
  
      return newTask.save();
  }


  async findAll():Promise<ITask[]> {
    const tasks =await this.taskModel.find()
    if(!tasks || tasks.length === 0){ 
      throw new NotFoundException('No task found')
    }
    return tasks;

    }
  
 

  async findOne(id: string):Promise<ITask> {

    const task = await this.taskModel.findById(id)
    if(!task){ 
        throw new NotFoundException('No task found')
      } 
    return task
    
  }

  async update(id: string, updateTaskDto: UpdateTaskDto):Promise<ITask> {
   const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {new: true})
    if(!task){ 
        throw new NotFoundException('No task found')
      }
    
      return task;
  
  }

  async remove(id: string):Promise<ITask> {
    const task = await this.taskModel.findByIdAndDelete(id);
      if(!task){ 
        throw new NotFoundException('No task found')  
      }
        await this.projectModel.updateOne({_id:task.project},{$pull:{tasks:task._id}})
    return task;
  }
}
