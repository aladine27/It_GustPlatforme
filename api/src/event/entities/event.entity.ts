import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({timestamps:true})
export class Event {
@Prop({required: true})
title: string;
@Prop({required: true})
description: string;
@Prop({required: true,})
duration: string;
@Prop({required: true})
startDate: Date;
@Prop({required: true})
location: String;
@Prop({required: true})
status: String;
@Prop({ type: SchemaTypes.ObjectId, ref: 'eventTypes', required: true })
eventType: Types.ObjectId;
@Prop({ type: SchemaTypes.ObjectId, ref: 'users', required: true })
user: Types.ObjectId;
@Prop([{ type: SchemaTypes.ObjectId, ref: 'users' }])
invited: Types.ObjectId[]; 


            
}
export const eventSchema = SchemaFactory.createForClass(Event);
