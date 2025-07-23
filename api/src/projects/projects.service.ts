import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { IProject } from './interfaces/project.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUser } from 'src/users/interfaces/user.interface';
import { ITask } from 'src/tasks/interfaces/task.interface';
import { ISprint } from 'src/sprints/interfaces/sprint.interface';
import { ITeam } from 'src/teams/interfaces/team.interface';

@Injectable()
export class ProjectsService {
constructor(@InjectModel('projects') private projectModel: Model<IProject>,

  @InjectModel('users') private userModel: Model<IUser>,
  @InjectModel('tasks') private taskModel: Model<ITask>,      // À ajouter
  @InjectModel('sprints') private sprintModel: Model<ISprint>,// À ajouter
  @InjectModel('teams') private teamModel: Model<ITeam>, 
) {}


   async create(createProjectDto: CreateProjectDto):Promise<IProject> {
      const newProject = new  this.projectModel(createProjectDto);
      await this.userModel.updateOne({ _id: createProjectDto.user }, { $push: { projects: newProject._id } })
      
  
      return newProject.save();
    }
    async findProjectByuserId(user: string):Promise<IProject[]> {
    const projectUser = await this.projectModel.find({user}).populate('user')
    if(!projectUser){ 
        throw new NotFoundException('No project found for this user')
      }
      return projectUser;
    }
     async findProjectBycategory(category: string):Promise<IProject[]> {
    const projectCategory = await this.projectModel.find({category}).populate('category')
    if(!projectCategory){ 
        throw new NotFoundException('No project found for this category')
      }
      return projectCategory;
    }
  
    async findAll():Promise<IProject[]> {
      const projects = await this.projectModel.find().populate('user');  
      if(!projects || projects.length === 0){ 
        throw new NotFoundException('No project found')
      }
      return projects;
  
      }
  
   async findOne(id: string):Promise<IProject> {
    const project = await this.projectModel.findById(id).populate('user');
    if(!project){ 
        throw new NotFoundException('No project found')
      }
      return project
    }
  
   async update(id: string, updateProjectDto: UpdateProjectDto):Promise<IProject> {
    
    const project = await this.projectModel.findByIdAndUpdate(id, updateProjectDto, {new: true})
    if(!project){ 
        throw new NotFoundException('No project found')
      }
    
      return project;
    }
  
    async remove(id: string):Promise<IProject> {
      const  project= await this.projectModel.findByIdAndDelete(id);
      
       if(!project){ 
        throw new NotFoundException('No project found')
      }
      await this.userModel.updateOne({ _id: project.user }, { $pull: { projects: project._id } })    

  await this.taskModel.deleteMany({ project: id });

  await this.sprintModel.deleteMany({ project: id });
  
  await this.teamModel.deleteMany({ project: id }); 
    
      return project;
    
    }
}
