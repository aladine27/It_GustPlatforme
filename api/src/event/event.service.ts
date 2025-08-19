import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEvent } from './interfaces/event.interface';
import { IEventType } from 'src/event-type/interfaces/eventType.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import { NotificationService } from 'src/notification/notification.service';


@Injectable()
export class EventService {
  constructor (@InjectModel('events') private eventModel: Model<IEvent>,
              @InjectModel('eventTypes') private eventTypeModel: Model<IEventType>,
              @InjectModel('users') private userModel: Model<IUser>,
              private readonly notificationService:NotificationService,
            ) {}
  async create(createEventDto: CreateEventDto):Promise<IEvent> {
    const newEvent = new this.eventModel(createEventDto);
    await this.eventTypeModel.updateOne({_id:createEventDto.eventType},{$push:{events:newEvent._id  }})
    await this.userModel.updateOne({_id:createEventDto.user},{$push:{events:newEvent._id  }})
    const savedEvent = await newEvent.save();
    this.notificationService.sendNotifToUsers(createEventDto.invited,newEvent.title,"un nouveau évènement est ajouté")
    return savedEvent;
  }
  async getEventByUserID(user: string):Promise<IEvent[]> {
    const userEvents = await this.eventModel.find({user}).populate('user')
    if(!userEvents){ 
      throw new NotFoundException('No event for this user found')
    }
    return userEvents;
    
  }

  async findAll():Promise<IEvent[]> {
    const events = await  this.eventModel.find().populate('eventType').populate('invited').populate('user');
    if (!events || events.length === 0) {
      throw new NotFoundException('No events found');
    } 
    return events;
  }


  async findOne(id: string):Promise<IEvent> {
    const event = await this.eventModel.findById(id).populate('eventType').populate('invited').populate('user');
    if (!event) {
      throw new NotFoundException('No event found');
    }
    return event;
  }
 async update(id: string, updateEventDto: UpdateEventDto): Promise<IEvent> {
    // 1) Récupérer l'état AVANT pour comparer les invités
    const before = await this.eventModel.findById(id).select('invited user title');
    if (!before) {
      throw new NotFoundException('No event found');
    }

    // 2) Mettre à jour et récupérer l'état APRÈS
    const event = await this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true });
    if (!event) {
      throw new NotFoundException('No event found');
    }

    // 3) Calcul des deltas d'invités (ajoutés / retirés)
    const prevInv = ((before as any).invited || []).map((x: any) => String(x));
    const nextInv = ((event as any).invited || []).map((x: any) => String(x));

    const prevSet = new Set(prevInv);
    const nextSet = new Set(nextInv);

    const addedInvited = nextInv.filter((u) => !prevSet.has(u));
    const removedInvited = prevInv.filter((u) => !nextSet.has(u));
    const stillInvited = nextInv.filter((u) => prevSet.has(u)); // invités présents avant et après

    // 4) Notifs manquantes :
    // 4.1 Nouveaux invités
    if (addedInvited.length) {
      this.notificationService.sendNotifToUsers(addedInvited, event.title, 'vous avez été invité à un évènement');
    }

    // 4.2 Invités retirés
    if (removedInvited.length) {
      this.notificationService.sendNotifToUsers(removedInvited, event.title, 'votre invitation a été retirée');
    }

    // 4.3 Invités toujours concernés → mise à jour
    if (stillInvited.length) {
      this.notificationService.sendNotifToUsers(stillInvited, event.title, 'évènement mis à jour');
    }

    // 4.4 Créateur (propriétaire) → mise à jour
    this.notificationService.sendNotifToUser(String((event as any).user), event.title, 'votre évènement a été mis à jour');

    return event;
  }

  async remove(id: string): Promise<IEvent> {
    const event = await this.eventModel.findByIdAndDelete(id);
    if (!event) {
      throw new NotFoundException('No event found');
    }

    await this.eventTypeModel.updateOne({ _id: (event as any).eventType }, { $pull: { events: event._id } });
    await this.userModel.updateOne({ _id: (event as any).user }, { $pull: { events: event._id } });

    // Notifier invités + créateur (suppression)
    const invitedIds = ((event as any).invited || []).map((x: any) => String(x));
    if (invitedIds.length) {
      this.notificationService.sendNotifToUsers(invitedIds, String((event as any).title), 'évènement annulé/supprimé');
    }
    this.notificationService.sendNotifToUser(
      String((event as any).user),
      String((event as any).title),
      'votre évènement a été supprimé'
    );

    return event;
  }
}