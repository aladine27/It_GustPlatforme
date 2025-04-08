import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { timestamp } from "rxjs";

@Schema({timestamps:true})
export class User {
  @Prop({required: true})
    fullName: string;
     @Prop({required: true, unique: true})
    email: string;
     @Prop({required: true})
    address: string;
     @Prop({required: true})
    phone: string;
     @Prop({required: true})
    password: string;
   @Prop({required: true})
    image: string; 
    @Prop({required: true})
    role: string;
    @Prop([{type:SchemaTypes.ObjectId, ref: 'leaves'}])
    leaves: Types.ObjectId[];
    @Prop([{type:SchemaTypes.ObjectId, ref: 'documents'}])
    documents: Types.ObjectId[];
    @Prop([{type:SchemaTypes.ObjectId, ref: 'fraisAdvantages'}])
    fraisAdvantages: Types.ObjectId[];
    @Prop([{type:SchemaTypes.ObjectId, ref: 'projects'}])
    projects: Types.ObjectId[];
    @Prop([{type:SchemaTypes.ObjectId, ref: 'jobOffres'}])
    joboffres: Types.ObjectId[];
  
  
  



}
export const userSchema = SchemaFactory.createForClass(User);
