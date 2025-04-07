import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFraiTypeDto } from './dto/create-frai-type.dto';
import { UpdateFraiTypeDto } from './dto/update-frai-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IfraiType } from './interfaces/fraiType.interface';

@Injectable()
export class FraiTypeService {
  constructor(@InjectModel('fraiTypes') private fraiTypeModel: Model<IfraiType>) {}
  async create(createFraiTypeDto: CreateFraiTypeDto):Promise<IfraiType> {
   const newFraiType = new  this.fraiTypeModel(createFraiTypeDto);

    return newFraiType.save();
  }

  async findAll():Promise<IfraiType[]> {
    const fraiTypes = await this.fraiTypeModel.find()
    if(!fraiTypes || fraiTypes.length === 0){ 
      throw new NotFoundException('No fraiTypes found')
    }
    return fraiTypes;
  }

  async findOne(id: string):Promise<IfraiType>  {
   const fraiType = await this.fraiTypeModel.findById(id)
   if (!fraiType){
    throw new NotFoundException('No fraiType found')
    
   }
   return fraiType
  }

  async update(id: string, updateFraiTypeDto: UpdateFraiTypeDto):Promise<IfraiType> {
    const fraiType = await this.fraiTypeModel.findByIdAndUpdate(id, updateFraiTypeDto, {new: true}) 
    if (!fraiType){
      throw new NotFoundException('No fraiType found')
      
    }
    return fraiType;
   
  }

  async remove(id: string):Promise<IfraiType> { 
    const fraiType = await this.fraiTypeModel.findByIdAndDelete(id);
    if (!fraiType){
      throw new NotFoundException('No fraiType found')
      
    }
    return fraiType;
  }
}
