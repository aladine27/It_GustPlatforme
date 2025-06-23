import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ileave } from './interfaces/Ileave.interface';
import { IleaveType } from 'src/leave-type/interfaces/leaveType.interface';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class LeaveService {
  constructor(@InjectModel('leaves') private leaveModel: Model<Ileave>
,  @InjectModel('leaveTypes') private leaveTypeModel: Model<IleaveType>,
   @InjectModel('users') private userModel: Model<IUser>

) {}
  async create(createLeaveDto: CreateLeaveDto): Promise<Ileave> {
    const newLeave = new this.leaveModel(createLeaveDto);
    await this.userModel.updateOne({_id:createLeaveDto.user},{$push:{leaves:newLeave._id}})
    await this.leaveTypeModel.updateOne({ _id: createLeaveDto.leaveType }, { $push: { leaves: newLeave._id } });
    
  return newLeave.save();
  }
  async findLeaveByUserId(user: string):Promise<Ileave[]> {
    const leaveUser = await this.leaveModel.find({user}).populate('user')
  
      return leaveUser;
    }
   
  async findAll(): Promise<Ileave[]> {
    const leaves = await this.leaveModel.find().populate('user').populate('leaveType');
 
    return leaves;
    
  }

  async findOne(id: string):Promise<Ileave> {
    const leave = await this.leaveModel.findById(id).populate('user').populate('leaveType');
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
     await this.userModel.updateOne({_id:leave.user},{$push:{leaves:leave._id}})
    await this.leaveTypeModel.updateOne({ _id: leave.leaveType }, { $push: { leaves: leave._id } });
    return leave;
  }
}
