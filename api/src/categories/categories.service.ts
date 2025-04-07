import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Icategory } from './interfaces/category.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel('categories') private categoryModel: Model<Icategory>) {}
 async create(createCategoryDto: CreateCategoryDto):Promise<Icategory> {
     const newCategory = new  this.categoryModel(createCategoryDto);

    return newCategory.save();
  }

  async findAll():Promise<Icategory[]> {
      const categories = await this.categoryModel.find()
        if(!categories || categories.length === 0){ 
          throw new NotFoundException('No categories found')
        }
        return categories;
    
  }

   async findOne(id: string):Promise<Icategory> {
    const category = await this.categoryModel.findById(id)
    if(!category){ 
        throw new NotFoundException('No category found')
      }
      return category
    }

  async update(id: string, updateCategoryDto: UpdateCategoryDto):Promise<Icategory> {
   
   const category = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {new: true})
   if(!category){ 
       throw new NotFoundException('No category found')
     }
   
     return category;
   }

  async remove(id: string):Promise<Icategory> {
      const category = await this.categoryModel.findByIdAndDelete(id);
       if(!category){ 
        throw new NotFoundException('No category found')
      }
    
      return category;
    
    }
}


