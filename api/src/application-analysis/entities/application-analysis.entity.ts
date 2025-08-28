import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { timestamp } from "rxjs";

@Schema({ timestamps: true })
export class ApplicationAnalysis {
  @Prop({ required: true })
  filename: string;

  @Prop()
  email?: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: Number, default: 0 })
  scoreIA: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'applications', required: true })
  application: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'jobOffres', required: true })
  jobOffre: Types.ObjectId;
}

export const applicationAnalysisSchema = SchemaFactory.createForClass(ApplicationAnalysis);
