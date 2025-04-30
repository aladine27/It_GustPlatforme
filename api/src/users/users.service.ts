import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { randomBytes } from 'crypto';

import * as argon2 from 'argon2';
@Injectable()
export class UsersService {
  constructor(@InjectModel('users') private userModel: Model<IUser>) {}

  

  async generateRandomPassword():Promise<string> {
    const randomBytesPromise = new Promise<string>((resolve, reject) => {
      randomBytes(8, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer.toString('hex'));
        }
      });
    });
    return randomBytesPromise;
  }

  async create(createUserDto: CreateUserDto): Promise<IUser>  {
  
    const plainPassword =  await this.generateRandomPassword();
    console.log('Generated password:', plainPassword);  
    const newUser = new this.userModel({
      ...createUserDto,
      password: plainPassword,
    });

    const user = await newUser.save();
    return user;

    /*// 4) On renvoie l’utilisateur avec le mot de passe en clair
    //    (utile si tu veux l’envoyer par mail)
    return {
      ...saved.toObject(),
      plainPassword,
    };*/
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
  async findbyEmail(email:string):Promise<IUser>  {
    const userEmail = await this.userModel.findOne({email})
    if(!userEmail){ 
      throw new NotFoundException('No userEmail found')
    }
    return userEmail
  }
  async findUserByRole(role:string):Promise<IUser[]> {
    const users = await this.userModel.find({role})
    if(!users || users.length === 0){ 
      throw new NotFoundException('No users for this role found')
    }
    return users;
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
