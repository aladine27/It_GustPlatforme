import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFraisAdvantageDto } from './dto/create-frais-advantage.dto';
import { UpdateFraisAdvantageDto } from './dto/update-frais-advantage.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFraisAdvantage } from './interfaces/fraisAdvantage.interface';
import { FraisAdvantage } from './entities/frais-advantage.entity';
import { IfraiType } from 'src/frai-type/interfaces/fraiType.interface';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class FraisAdvantageService {
  constructor(@InjectModel('fraisAdvantages') private fraisAdvantageModel: Model<IFraisAdvantage>,
              @InjectModel('fraiTypes') private fraiTypeModel: Model<IfraiType>,
            @InjectModel('users') private userModel: Model<IUser>
            ) {}
  
  async create(createFraisAdvantageDto: CreateFraisAdvantageDto):Promise<IFraisAdvantage> {
    const newFraisAdvantage = new  this.fraisAdvantageModel(createFraisAdvantageDto);
    await this.fraiTypeModel.updateOne({ _id: createFraisAdvantageDto.fraiType }, { $push: { fraisAdvantages: newFraisAdvantage._id } });
    await this.userModel.updateOne({ _id: createFraisAdvantageDto.user }, { $push: { fraisAdvantages: newFraisAdvantage._id } });
    return newFraisAdvantage.save();
  }

  async findAll():Promise<IFraisAdvantage[]> {
    const fraisAdvantages = await this.fraisAdvantageModel.find()
    if(!fraisAdvantages || fraisAdvantages.length === 0){ 
      throw new NotFoundException('No fraisAdvantage found')
    }
    return fraisAdvantages;
    
  }


  async findOne(id: string):Promise<IFraisAdvantage> {
      const fraisAdvantage = await this.fraisAdvantageModel.findById(id)
      if(!fraisAdvantage){
        throw new NotFoundException('No fraisAdvantage found')
      }
      return fraisAdvantage;
  }

  async update(id: string, updateFraisAdvantageDto: UpdateFraisAdvantageDto):Promise<IFraisAdvantage> {
    const fraisAdvantage = await this.fraisAdvantageModel.findByIdAndUpdate(id, updateFraisAdvantageDto, {new: true})
    if(!fraisAdvantage){
      throw new NotFoundException('No fraisAdvantage found')
    }
    return fraisAdvantage;
    
  }

  async remove(id: string):Promise<IFraisAdvantage>  {
    const fraisAdvantage = await this.fraisAdvantageModel.findByIdAndDelete(id);
    if(!fraisAdvantage){
      throw new NotFoundException('No fraisAdvantage found')
    }
    await this.fraiTypeModel.updateOne({ _id: fraisAdvantage.fraiType }, { $pull: { fraisAdvantages: fraisAdvantage._id } });
    await this.userModel.updateOne({ _id: fraisAdvantage.user }, { $pull: { fraisAdvantages: fraisAdvantage._id } });
    return fraisAdvantage;  
    }
  
}
