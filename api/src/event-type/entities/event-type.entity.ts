
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
@Schema({timestamps:true})
export class EventType {
     @Prop({required: true})
        name: string;
}
export const EventTypeSchema = SchemaFactory.createForClass(EventType);
