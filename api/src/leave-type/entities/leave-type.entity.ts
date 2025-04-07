
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export class LeaveType {
     @Prop({required: true})
        name: string;
}
export const LeaveTypeSchema = SchemaFactory.createForClass(LeaveType);