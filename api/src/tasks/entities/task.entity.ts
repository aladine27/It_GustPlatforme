

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps:true})
export class Task {  
        @Prop({required: true})
        title: string;
         @Prop({required: true})
        description: string;
         @Prop({required: true,})
        duration: string;
         @Prop({required: true})
        startDate: Date;
         @Prop({required: true})
        endDate: Date;
         @Prop({required: true})
        status: String;
}
export const taskSchema = SchemaFactory.createForClass(Task);
