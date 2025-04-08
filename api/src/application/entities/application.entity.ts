import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { timestamp } from "rxjs";

@Schema({timestamps:true})
export class Application {
    
     @Prop({required: true, unique: true})
    cvFile: string;
    @Prop({ type: SchemaTypes.ObjectId, ref: 'jobOffres', required: true })
    jobOffre: Types.ObjectId;
    
}
export const applicationSchema = SchemaFactory.createForClass(Application);
