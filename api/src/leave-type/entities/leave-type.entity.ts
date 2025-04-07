
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
@Schema({timestamps:true})
export class LeaveType {
     @Prop({required: true})
     name: string;
}
export const LeaveTypeSchema = SchemaFactory.createForClass(LeaveType);