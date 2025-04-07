import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { timestamp } from "rxjs";

@Schema({timestamps:true})
export class Document {
    @Prop({required: true})
    title:string;
    @Prop({required: true})
    delevryDate:Date;
    @Prop({required: true})
    traitementDateLimite:Date;
     @Prop({required: true})
    status:string;
     @Prop({required: true})
    reason:string
}
export const documentSchema = SchemaFactory.createForClass(Document);


