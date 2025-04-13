import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEvent } from './interfaces/event.interface';
import { IEventType } from 'src/event-type/interfaces/eventType.interface';
import { IUser } from 'src/users/interfaces/user.interface';


@Injectable()
export class EventService {
  constructor (@InjectModel('events') private eventModel: Model<IEvent>,
              @InjectModel('eventTypes') private eventTypeModel: Model<IEventType>,
              @InjectModel('users') private userModel: Model<IUser>
            ) {}
  async create(createEventDto: CreateEventDto):Promise<IEvent> {
    const newEvent = new this.eventModel(createEventDto);
    await this.eventTypeModel.updateOne({_id:createEventDto.eventType},{$push:{events:newEvent._id  }})
    await this.userModel.updateOne({_id:createEventDto.user},{$push:{events:newEvent._id  }})
    return newEvent.save();
    
  }
  async getEventByUserID(user: string):Promise<IEvent[]> {
    const userEvents = await this.eventModel.find({user}).populate('user')
    if(!userEvents){ 
      throw new NotFoundException('No event for this user found')
    }
    return userEvents;
    
  }

  async findAll():Promise<IEvent[]> {
    const events = await  this.eventModel.find();
    if (!events || events.length === 0) {
      throw new NotFoundException('No events found');
    } 
    return events;
  }


  async findOne(id: string):Promise<IEvent> {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new NotFoundException('No event found');
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto):Promise<IEvent> {
    const event = await this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true });
    if (!event) {
      throw new NotFoundException('No event found');
    }
    return event;
  }

  async remove(id: string):Promise<IEvent> {
    const event = await this.eventModel.findByIdAndDelete(id);
    if (!event) {
      throw new NotFoundException('No event found');
    }
     await this.eventTypeModel.updateOne({_id:event.eventType},{$pull:{events:event._id  }})
     await this.userModel.updateOne({_id:event.user},{$pull:{events:event._id  }})
    return event;
  }
}
