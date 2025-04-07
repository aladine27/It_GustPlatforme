
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
@Schema({timestamps:true})
export class JobCategory {

    
  
        @Prop({required: true})
        name: string;
       
    
    
    
    
}
 export const JobCategorySchema = SchemaFactory.createForClass(JobCategory);
