import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IApplication } from './interfaces/application.interface';
import { Model } from 'mongoose';
import { IJobOffre } from 'src/job-offre/interfaces/jobOffre.interface';

@Injectable()
export class ApplicationService {
  constructor(@InjectModel('applications') private applicationModel: Model<IApplication>,
    @InjectModel('jobOffres') private joboffreModel: Model<IJobOffre>){}
  async create(createApplicationDto: CreateApplicationDto):Promise<IApplication> {
    const newApplication = new this.applicationModel(createApplicationDto);
   await this.joboffreModel.updateOne({ _id: createApplicationDto.jobOffre }, { $push: { applications: newApplication._id } });
    return newApplication.save();
  }

  async findAll():Promise<IApplication[]> {
    const applications = await this.applicationModel.find()
    if(!applications || applications.length === 0){ 
      throw new NotFoundException('No application found')
    }
    return applications;
    
  }

  async findOne(id: string):Promise<IApplication> { 
   const application = await this.applicationModel.findById(id)
   if(!application){ 
    throw new NotFoundException('No application found')
  }
  return application
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto):Promise<IApplication> {
    const application = await this.applicationModel.findByIdAndUpdate(id, updateApplicationDto, {new: true}) 
    if(!application){
      throw new NotFoundException('No application found')
    }
    return application
  }

  async remove(id: string):Promise<IApplication> {
   const application = await this.applicationModel.findByIdAndDelete(id);
   if (!application) {
    throw new NotFoundException('No application found');
  }
  await this.joboffreModel.updateOne({ _id: application.jobOffre },  { $pull: { applications: application._id } });
  return application;
  
  }
}
