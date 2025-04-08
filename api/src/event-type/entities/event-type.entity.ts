
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
@Schema({timestamps:true})
export class EventType {
     @Prop({required: true})
        name: string;
 @Prop([{type:SchemaTypes.ObjectId, ref: 'events'}])
    events: Types.ObjectId[];
}
export const EventTypeSchema = SchemaFactory.createForClass(EventType);
