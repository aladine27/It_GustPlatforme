import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
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
  



}
export const userSchema = SchemaFactory.createForClass(User);
