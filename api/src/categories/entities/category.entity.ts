
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";


@Schema({timestamps:true})
export class Category {
    @Prop({required: true})
    name: string;
    @Prop([{type:SchemaTypes.ObjectId, ref: 'projects'}])
    projects: Types.ObjectId[];
   


}
export const categorySchema = SchemaFactory.createForClass(Category);