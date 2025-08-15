import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({timestamps:true})
export class Notification{
    @Prop({required:true})
    message:string;
    @Prop({required:true})
    status:Boolean;
    @Prop({required:true})
    title:string;
    @Prop({ type: SchemaTypes.ObjectId, ref: 'users', required: true })
    user:Types.ObjectId;




}
export const notificationSchema = SchemaFactory.createForClass(Notification);