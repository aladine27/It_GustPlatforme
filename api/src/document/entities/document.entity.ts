import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { timestamp } from "rxjs";

@Schema({timestamps:true})
export class Document {
    @Prop({required: true})
    title:string;
    @Prop({})
    delevryDate:Date;
    @Prop()
    traitementDateLimite:Date;
     @Prop({required: true})
    status:string;
     @Prop({required: true})
    reason:string;
    @Prop({ type: SchemaTypes.ObjectId, ref: 'users', required: true })
    user: Types.ObjectId;
    @Prop({ required: false, default: null })
    file: string;
    
 
    
}
export const documentSchema = SchemaFactory.createForClass(Document);


