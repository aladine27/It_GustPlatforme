import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({timestamps:true})
export class Project {


      @Prop({required: true})
      title: string;
      @Prop({required: true})
      description: string;
      @Prop({required: true,})
      duration: string;
      @Prop({required: true})
      file: string;
      @Prop({required: true})
      startDate: Date;
      @Prop({required: true})
      endDate: Date;
      @Prop({required: true})
      status: String;
      @Prop({ type: SchemaTypes.ObjectId, ref: 'users', required: true })
      user: Types.ObjectId;
      @Prop([{ type: SchemaTypes.ObjectId, ref: 'sprints' }])
      sprints: Types.ObjectId[];
      @Prop([{ type: SchemaTypes.ObjectId, ref: 'teams' }])
      teams: Types.ObjectId[];


        
      



       
}
export const projectSchema = SchemaFactory.createForClass(Project);
