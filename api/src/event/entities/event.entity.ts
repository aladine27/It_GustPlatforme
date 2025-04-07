import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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

            
}
export const eventSchema = SchemaFactory.createForClass(Event);
