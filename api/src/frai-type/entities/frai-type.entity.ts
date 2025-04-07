import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({timestamps:true})
export class FraiType {
    @Prop({required: true})
    name: string;
    @Prop({required: true})
    amount: number;
    @Prop([{type:SchemaTypes.ObjectId, ref: 'fraisAdvantages'}])
    fraisAdvantages: Types.ObjectId[];
    
}
export const FraiTypeSchema = SchemaFactory.createForClass(FraiType);


