import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps:true})
export class FraiType {
    @Prop({required: true})
    name: string;
    @Prop({required: true})
    amount: number;
    
}
export const FraiTypeSchema = SchemaFactory.createForClass(FraiType);


