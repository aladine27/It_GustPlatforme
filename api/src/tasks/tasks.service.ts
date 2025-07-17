import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ITask } from './interfaces/task.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProject } from 'src/projects/interfaces/project.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import { ISprint } from 'src/sprints/interfaces/sprint.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('projects') private projectModel: Model<IProject>,
    @InjectModel('tasks') private taskModel: Model<ITask>,
    @InjectModel('users') private userModel: Model<IUser>,
    @InjectModel('sprints') private sprintModel: Model<ISprint>
  ) {}

  // Créer une tâche et retourner avec le user peuplé
  async create(createTaskDto: CreateTaskDto): Promise<ITask> {
    const newTask = new this.taskModel(createTaskDto);
    await this.projectModel.updateOne({ _id: createTaskDto.project }, { $push: { tasks: newTask._id } });
    await this.userModel.updateOne({ _id: createTaskDto.user }, { $push: { tasks: newTask._id } });
    await this.sprintModel.updateOne({ _id: createTaskDto.sprint }, { $push: { tasks: newTask._id } });
    
    return newTask.save();
    

  }

  // Récupère toutes les tâches d'un user, avec user peuplé
  async getTaskByUserID(user: string): Promise<ITask[]> {
    const userTasks = await this.taskModel.find({ user }).populate('user');
    if (!userTasks) {
      throw new NotFoundException('No task for this user found');
    }
    return userTasks;
  }

  // Récupère toutes les tâches d'un sprint avec user peuplé
  async findBySprint(sprintId: string): Promise<ITask[]> {
    return this.taskModel.find({ sprint: sprintId }).populate('user');
  }

  // Récupère toutes les tâches d'un sprint (avec user peuplé)
  async findAll(sprintId: string): Promise<ITask[]> {
    const tasks = await this.taskModel.find({ sprint: sprintId }).populate('user');
    if (!tasks) {
      throw new NotFoundException('No task found');
    }
    return tasks;
  }

  // Récupère une tâche par son id, avec user peuplé
  async findOne(id: string): Promise<ITask> {
    const task = await this.taskModel.findById(id).populate('user');
    if (!task) {
      throw new NotFoundException('No task found');
    }
    return task;
  }

  // Update une tâche et retourne la nouvelle valeur, peuplée
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<ITask> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .populate('user');
    if (!task) {
      throw new NotFoundException('No task found');
    }
    return task;
  }

  // Supprime une tâche (inutile de populate ici)
  async remove(id: string): Promise<ITask> {
    const task = await this.taskModel.findByIdAndDelete(id);
    if (!task) throw new NotFoundException('No task found');
    await this.projectModel.updateOne({ _id: task.project }, { $pull: { tasks: task._id } });
    await this.userModel.updateOne({ _id: task.user }, { $pull: { tasks: task._id } });
    await this.sprintModel.updateOne({ _id: task.sprint }, { $pull: { tasks: task._id } });
    return task;
  }
}
