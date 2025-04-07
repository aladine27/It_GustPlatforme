
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
@Schema({timestamps:true})
export class JobCategory {

    
  
        @Prop({required: true})
        name: string;
        @Prop([{type:SchemaTypes.ObjectId, ref: 'jobOffres'}])
        joboffres: Types.ObjectId[];

       
    
    
    
    
}
 export const JobCategorySchema = SchemaFactory.createForClass(JobCategory);
