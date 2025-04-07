
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export class EventType {
     @Prop({required: true})
        name: string;
}
export const EventTypeSchema = SchemaFactory.createForClass(EventType);
