// src/sprints/entities/sprint.entity.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({timestamps:true})
export class Sprint extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  duration: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'projects', required: true })
  project: Types.ObjectId;

@Prop({ type: Types.ObjectId, ref: 'teams', required: false })
team: Types.ObjectId; 
  @Prop([{ type: Types.ObjectId, ref: 'tasks' }])
  tasks: Types.ObjectId[];

}
export const SprintSchema = SchemaFactory.createForClass(Sprint);
