import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ileave } from './interfaces/Ileave.interface';

@Injectable()
export class LeaveService {
  constructor(@InjectModel('leaves') private leaveModel: Model<Ileave>) {}
  async create(createLeaveDto: CreateLeaveDto): Promise<Ileave> {
    const newLeave = new this.leaveModel(createLeaveDto);
    return newLeave.save();
  }
   
  async findAll(): Promise<Ileave[]> {
    const leaves = await this.leaveModel.find();
    if (!leaves || leaves.length === 0) {
      throw new NotFoundException('No leaves found');
    }
    return leaves;
    
  }

  async findOne(id: string):Promise<Ileave> {
    const leave = await this.leaveModel.findById(id);
    if (!leave) {
      throw new NotFoundException('No leave found');
    }
    return leave;
  }

  async update(id: string, updateLeaveDto: UpdateLeaveDto):Promise<Ileave> {
   const leave = await this.leaveModel.findByIdAndUpdate(id, updateLeaveDto, { new: true });
    if (!leave) { 
      throw new NotFoundException('No leave found');
    }
    return leave;
  }

  async remove(id: string) {
    const leave = await this.leaveModel.findByIdAndDelete(id);
    if (!leave) {
      throw new NotFoundException('No leave found');
    }
    return leave;
  }
}
