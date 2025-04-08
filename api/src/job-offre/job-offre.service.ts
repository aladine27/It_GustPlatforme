import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobOffreDto } from './dto/create-job-offre.dto';
import { UpdateJobOffreDto } from './dto/update-job-offre.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IJobOffre } from './interfaces/jobOffre.interface';

import { IjobCategory } from 'src/job-category/interfaces/jobCategory.interface';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class JobOffreService {
    constructor(@InjectModel('jobOffres') private joboffreModel: Model<IJobOffre>
    ,@InjectModel('jobCategories') private jobCategoryModel: Model<IjobCategory>, @InjectModel('users') private userModel: Model<IUser>) {}
  async create(createJobOffreDto: CreateJobOffreDto):Promise<IJobOffre> {
    const newJobOffre = new  this.joboffreModel(createJobOffreDto);
    await this.userModel.updateOne({_id:createJobOffreDto.user},{$push:{documents:newJobOffre._id}})
    await this.jobCategoryModel.updateOne({_id:createJobOffreDto.user},{$push:{documents:newJobOffre._id}})
    return newJobOffre.save();
  }

  async findAll():Promise<IJobOffre[]> {
    const jobOffres = await this.joboffreModel.find()
    if(!jobOffres || jobOffres.length === 0){ 
      throw new NotFoundException('No jobOffre found')
    }
    return jobOffres;

    } 
    

  async findOne(id: string):Promise<IJobOffre> {
   const jobOffre = await this.joboffreModel.findById(id)
    if(!jobOffre){ 
        throw new NotFoundException('No jobOffre found')
      }
      return jobOffre
    
  }

  async update(id: string, updateJobOffreDto: UpdateJobOffreDto):Promise<IJobOffre> {
    const jobOffre = await this.joboffreModel.findByIdAndUpdate(id, updateJobOffreDto, {new: true})
    if(!jobOffre){ 
        throw new NotFoundException('No jobOffre found')
      }
      return jobOffre;
  }

  async remove(id: string):Promise<IJobOffre> {
    const jobOffre = await this.joboffreModel.findByIdAndDelete(id);
   if (!jobOffre) {
    throw new NotFoundException('No jobOffre found')
  }
    return jobOffre;
  }
}
