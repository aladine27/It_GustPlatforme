import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { eventSchema } from './entities/event.entity';

@Module({
   imports: [MongooseModule.forFeature([{ name: 'events', schema: eventSchema }])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
