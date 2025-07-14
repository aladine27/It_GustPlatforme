import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Team {
  @Prop({ required: true })
  title: string;

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'users' }])
  employeeList: Types.ObjectId[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'projects', required: true })
  project: Types.ObjectId;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
