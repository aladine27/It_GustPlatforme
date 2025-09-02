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
  // 1) état AVANT (Doc Mongoose)
  const before = await this.eventModel.findById(id).select('invited user title description startDate duration location eventType status');
  if (!before) throw new NotFoundException('No event found');

  // 2) maj + état APRÈS (Doc Mongoose)
  const event = await this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true });
  if (!event) throw new NotFoundException('No event found');

  // ---- A) SILENCE si seul "status" est mis à jour ----
  const changedKeys = Object.keys(updateEventDto ?? {});
  const onlyStatusChanged = changedKeys.length === 1 && changedKeys[0] === 'status';
  if (onlyStatusChanged) {
    // pas de notifications pour une MAJ auto de statut
    return event;
  }

  // 3) deltas d'invités
  const prevInv = (before.get('invited') || []).map((x: any) => String(x));
  const nextInv = (event.get('invited')  || []).map((x: any) => String(x));
  const prevSet = new Set(prevInv);
  const nextSet = new Set(nextInv);

  const addedInvited   = nextInv.filter(u => !prevSet.has(u));
  const removedInvited = prevInv.filter(u => !nextSet.has(u));
  const stillInvited   = nextInv.filter(u => prevSet.has(u));

  // 4) notifier uniquement si VRAI changement métier (hors status)
  const meaningfulKeys: (keyof IEvent)[] = ['title','description','startDate','duration','location','eventType'];
  const hasMeaningfulChange = meaningfulKeys.some((k) => {
    const beforeVal = (before.get(k as string) as any)?.toString?.() ?? before.get(k as string);
    const afterVal  = (event.get(k as string)  as any)?.toString?.() ?? event.get(k as string);
    return beforeVal !== afterVal;
  });

  // 4.1 Nouveaux invités
  if (addedInvited.length) {
    this.notificationService.sendNotifToUsers(addedInvited, event.get('title'), 'vous avez été invité à un évènement');
  }
  // 4.3 Invités toujours présents → notifier seulement si vrai changement
  if (stillInvited.length && hasMeaningfulChange) {
    this.notificationService.sendNotifToUsers(stillInvited, event.get('title'), 'évènement mis à jour');
  }
  // 4.4 Créateur → notifier seulement si vrai changement
  if (hasMeaningfulChange) {
    this.notificationService.sendNotifToUser(String(event.get('user')), event.get('title'), 'votre évènement a été mis à jour');
  }

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