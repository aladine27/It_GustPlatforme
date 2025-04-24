import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { timestamp } from "rxjs";
import { Admin } from "src/admin/entities/admin.entity";
import { Employe } from "src/employe/entities/employe.entity";
import { Manager } from "src/manager/entities/manager.entity";
import { Rh } from "src/rh/entities/rh.entity";
import * as argon2 from 'argon2';

@Schema({timestamps:true, discriminatorKey: 'role'})
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
    @Prop({required: true,type: String, enum: [Admin.name,Manager.name,Employe.name,Rh.name]}) 
    role: string;
    @Prop() 
    refreshToken: string;
    


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
    
    @Prop([{type:SchemaTypes.ObjectId, ref: 'tasks'}])
    tasks: Types.ObjectId[];
    @Prop([{type:SchemaTypes.ObjectId, ref: 'events'}])
    events: Types.ObjectId[];
  
  
  



}
export const userSchema = SchemaFactory.createForClass(User)
.pre('save', 
  async function () {
 this.password = await argon2.hash(this.password)
 }
)