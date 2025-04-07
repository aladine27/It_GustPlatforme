import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('users') private userModel: Model<IUser>) {}

  async create(createUserDto: CreateUserDto):Promise<IUser> {
    const newUser = new  this.userModel(createUserDto);

    return newUser.save();
  }

  async findAll():Promise<IUser[]> {
    const users = await this.userModel.find()
    if(!users || users.length === 0){ 
      throw new NotFoundException('No user found')
    }
    return users;

    }

 async findOne(id: string):Promise<IUser> {
  const user = await this.userModel.findById(id)
  if(!user){ 
      throw new NotFoundException('No user found')
    }
    return user
  }

 async update(id: string, updateUserDto: UpdateUserDto):Promise<IUser> {
  
  const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true})
  if(!user){ 
      throw new NotFoundException('No user found')
    }
  
    return user;
  }

  async remove(id: string):Promise<IUser> {
    const user = await this.userModel.findByIdAndDelete(id);
     if(!user){ 
      throw new NotFoundException('No user found')
    }
  
    return user;
  
  }
}
