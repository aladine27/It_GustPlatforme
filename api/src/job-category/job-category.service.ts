import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobCategoryDto } from './dto/create-job-category.dto';
import { UpdateJobCategoryDto } from './dto/update-job-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IjobCategory } from './interfaces/jobCategory.interface';
import { Model } from 'mongoose';



@Injectable()
export class JobCategoryService {
  constructor(@InjectModel('jobCategories') private jobCategoryModel: Model<IjobCategory>) {}
 async create(createJobCategoryDto: CreateJobCategoryDto):Promise<IjobCategory> {
     const newCategory = new  this.jobCategoryModel(createJobCategoryDto);

    return newCategory.save();
  }

  async findAll():Promise<IjobCategory[]> {
      const categories = await this.jobCategoryModel.find()
        if(!categories || categories.length === 0){ 
          throw new NotFoundException('No user found')
        }
        return categories;
    
  }

   async findOne(id: string):Promise<IjobCategory> {
    const category = await this.jobCategoryModel.findById(id)
    if(!category){ 
        throw new NotFoundException('No user found')
      }
      return category
    }

  async update(id: string, updateCategoryDto: UpdateJobCategoryDto):Promise<IjobCategory> {
   
   const category = await this.jobCategoryModel.findByIdAndUpdate(id, updateCategoryDto, {new: true})
   if(!category){ 
       throw new NotFoundException('No user found')
     }
   
     return category;
   }

  async remove(id: string):Promise<IjobCategory> {
      const category = await this.jobCategoryModel.findByIdAndDelete(id);
       if(!category){ 
        throw new NotFoundException('No user found')
      }
    
      return category;
    
    }
}
