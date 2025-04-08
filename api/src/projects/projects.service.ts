import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { IProject } from './interfaces/project.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Icategory } from 'src/categories/interfaces/category.interface';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class ProjectsService {
constructor(@InjectModel('projects') private projectModel: Model<IProject>,
@InjectModel('categories') private categoryModel: Model<Icategory>,
@InjectModel('users') private userModel: Model<IUser>
) {}


   async create(createProjectDto: CreateProjectDto):Promise<IProject> {
      const newProject = new  this.projectModel(createProjectDto);
      await this.categoryModel.updateOne({ _id: createProjectDto.category }, { $push: { projects: newProject._id } });
      await this.userModel.updateOne({ _id: createProjectDto.user }, { $push: { projects: newProject._id } })
      
  
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
      await this.categoryModel.updateOne({ _id: project.category }, { $pull: { projects: project._id } });
      await this.userModel.updateOne({ _id: project.user }, { $pull: { projects: project._id } })     
    
      return project;
    
    }
}
