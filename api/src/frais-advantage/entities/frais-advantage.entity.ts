import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { timestamp } from "rxjs";

@Schema({timestamps:true})
export class FraisAdvantage {
    @Prop({required: true})
    raison: string;
    @Prop({required: true})
    file: string;
    @Prop({required: true})
    status: string;
}
export const FraisAdvantageSchema = SchemaFactory.createForClass(FraisAdvantage);
