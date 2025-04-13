import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { eventSchema } from './entities/event.entity';
import { EventTypeSchema } from 'src/event-type/entities/event-type.entity';
import { userSchema } from 'src/users/entities/user.entity';

@Module({
   imports: [MongooseModule.forFeature([{ name: 'events', schema: eventSchema }]),
             MongooseModule.forFeature([{ name: 'eventTypes', schema: EventTypeSchema }]),
             MongooseModule.forFeature([{ name: 'users', schema: userSchema }])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
