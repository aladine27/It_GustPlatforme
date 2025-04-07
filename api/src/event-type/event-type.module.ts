import { Module } from '@nestjs/common';
import { EventTypeService } from './event-type.service';
import { EventTypeController } from './event-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventTypeSchema } from './entities/event-type.entity';

@Module({
   imports: [MongooseModule.forFeature([{ name: 'eventTypes', schema: EventTypeSchema }])],
  controllers: [EventTypeController],
  providers: [EventTypeService],
})
export class EventTypeModule {}
