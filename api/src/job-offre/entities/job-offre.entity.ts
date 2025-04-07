import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps:true})
export class JobOffre {
    @Prop({required: true})
    title: string;
    @Prop({required: true})
    description : string;
    @Prop({required: true})
    requirements :  string; 
    @Prop({required: true})
    emailContact: string;
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
   
}
export const JobOffreSchema = SchemaFactory.createForClass(JobOffre);
