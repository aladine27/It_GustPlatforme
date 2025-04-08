import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";


@Schema({timestamps:true})
export class FraisAdvantage {
    @Prop({required: true})
    raison: string;
    @Prop({required: true})
    file: string;
    @Prop({required: true})
    status: string;
    @Prop({type:[SchemaTypes.ObjectId], ref: 'fraiTypes',required: true})
    fraiType:Types.ObjectId;
     @Prop({ type: SchemaTypes.ObjectId, ref: 'users', required: true })
    user: Types.ObjectId;
}
export const FraisAdvantageSchema = SchemaFactory.createForClass(FraisAdvantage);
