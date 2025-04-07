
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
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
               
    
    
    }

export const leaveSchema = SchemaFactory.createForClass(Leave);

