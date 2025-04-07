import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEventType } from './interfaces/eventType.interface';

@Injectable()
export class EventTypeService {
  constructor(@InjectModel('eventTypes') private eventTypeModel: Model<IEventType>) {}
  
  async create(createEventTypeDto: CreateEventTypeDto):Promise<IEventType>  {
    const newEventType = new  this.eventTypeModel(createEventTypeDto);

    return newEventType.save();
  } 

  async findAll():Promise<IEventType[]> {
    const eventTypes = await this.eventTypeModel.find()
    if(!eventTypes || eventTypes.length === 0){ 
      throw new NotFoundException('No eventType found')
    }
    return eventTypes;

    }


  async findOne(id: string):Promise<IEventType> {
    const eventType = await this.eventTypeModel.findById(id) 
    if (!eventType){
      throw new NotFoundException('No eventType found')
    }
    return eventType;
    
  }

  async update(id: string, updateEventTypeDto: UpdateEventTypeDto):Promise<IEventType> {
   const eventType = await this.eventTypeModel.findByIdAndUpdate(id, updateEventTypeDto, {new: true})
   if (!eventType){
    throw new NotFoundException('No eventType found')
   }
   return eventType;
  }

  async remove(id: string):Promise<IEventType>  {
   const eventtype= await this.eventTypeModel.findByIdAndDelete(id);
   if (!eventtype){
    throw new NotFoundException('No eventType found')
   }
   return eventtype;
  }
}
