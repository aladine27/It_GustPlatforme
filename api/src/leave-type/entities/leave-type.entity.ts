
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
@Schema({timestamps:true})
export class LeaveType {
     @Prop({required: true})
     name: string;
     @Prop({required: true})
     limitDuration: string;
     @Prop([{type:SchemaTypes.ObjectId, ref: 'leaves'}])
     leaves: Types.ObjectId[];
     
}
export const LeaveTypeSchema = SchemaFactory.createForClass(LeaveType);