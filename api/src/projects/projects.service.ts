import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { IProject } from './interfaces/project.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProjectsService {
constructor(@InjectModel('projects') private projectModel: Model<IProject>) {}


   async create(createProjectDto: CreateProjectDto):Promise<IProject> {
      const newProject = new  this.projectModel(createProjectDto);
  
      return newProject.save();
    }
  
    async findAll():Promise<IProject[]> {
      const projects = await this.projectModel.find()
      if(!projects || projects.length === 0){ 
        throw new NotFoundException('No project found')
      }
      return projects;
  
      }
  
   async findOne(id: string):Promise<IProject> {
    const project = await this.projectModel.findById(id)
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
    
      return project;
    
    }
}
