
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps:true})
export class Category {
    @Prop({required: true})
    name: string;
   


}
export const categorySchema = SchemaFactory.createForClass(Category);