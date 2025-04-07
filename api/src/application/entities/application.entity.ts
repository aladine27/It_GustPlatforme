import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { timestamp } from "rxjs";

@Schema({timestamps:true})
export class Application {
    
     @Prop({required: true, unique: true})
    cvFile: string;
    
}
export const applicationSchema = SchemaFactory.createForClass(Application);
