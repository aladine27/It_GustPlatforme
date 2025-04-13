import { Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Rh {
    role: string;
}
export const RhSchema = SchemaFactory.createForClass(Rh);
