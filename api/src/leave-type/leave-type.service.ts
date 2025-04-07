import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IleaveType } from './interfaces/leaveType.interface';
import { Model } from 'mongoose';

@Injectable()
export class LeaveTypeService {
  constructor(@InjectModel('leaveTypes') private leaveTypeModel: Model<IleaveType>) {}
 async  create(createLeaveTypeDto: CreateLeaveTypeDto):Promise<IleaveType> {
    const newLeaveType = new  this.leaveTypeModel(createLeaveTypeDto);

   return newLeaveType.save();
   
  }

 async findAll():Promise<IleaveType[]> {
    const leaveTypes = await this.leaveTypeModel.find()
    if(!leaveTypes || leaveTypes.length === 0){ 
      throw new NotFoundException('No user found')
    }
    return leaveTypes;
  }

  async findOne(id: string):Promise<IleaveType>  {
    const leaveType = await this.leaveTypeModel.findById(id)
    if(!leaveType){
      throw new NotFoundException('No user found')
    }
    return leaveType
  }

  async update(id: string, updateLeaveTypeDto: UpdateLeaveTypeDto):Promise<IleaveType> {
    const leaveType = await this.leaveTypeModel.findByIdAndUpdate(id, updateLeaveTypeDto, {new: true})
     if(!leaveType){
      throw new NotFoundException('No user found')
     }
     return leaveType;
    
  }

  async remove(id: string):Promise<IleaveType>  {
    const leaveType = await this.leaveTypeModel.findByIdAndDelete(id);
    if(!leaveType){
      throw new NotFoundException('No user found')
    }
    return leaveType
    
  }
}
