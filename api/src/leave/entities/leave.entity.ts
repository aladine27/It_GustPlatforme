
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
@Schema({timestamps:true})
export class Leave { 
        @Prop({required: true})
        title: string;
        @Prop({required: true})
        duration: string;
         @Prop({required: true,})
        status: string;
         @Prop({required: true})
        startDate: Date;
         @Prop({required: true})
        endDate: Date;
         @Prop({required: true})
        reason: String;
        @Prop({required: true})
        reasonFile: string;
        @Prop({type:[SchemaTypes.ObjectId], ref: 'leaveTypes',required: true})
        leaveType:Types.ObjectId;
               
    
    
    }

export const leaveSchema = SchemaFactory.createForClass(Leave);

