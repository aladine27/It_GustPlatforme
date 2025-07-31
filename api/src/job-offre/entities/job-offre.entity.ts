import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({timestamps:true})
export class JobOffre {
    @Prop({required: true})
    title: string;
    @Prop({required: true})
    description : string;
    @Prop({required: true})
    requirements :  string; 
    @Prop({required: true})
    postedDate: Date; 
    @Prop({required: true})
    closingDate: Date;
    @Prop({required: true})
    salaryRange: number;
    @Prop({required: true})
    location: string;
    @Prop({required: true})
    status : string;
    @Prop({required: true})
    process: string;
    @Prop({required: true})
    type: string;
    @Prop({type:SchemaTypes.ObjectId, ref: 'jobCategories',required: true})
    jobCategory: Types.ObjectId;  
    @Prop([{type:SchemaTypes.ObjectId, ref: 'applications'}])
    applications: Types.ObjectId[];
    @Prop({ type: SchemaTypes.ObjectId, ref: 'users', required: true })
    user: Types.ObjectId;
   
}
export const JobOffreSchema = SchemaFactory.createForClass(JobOffre);
