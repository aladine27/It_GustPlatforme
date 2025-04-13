import { Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Manager {
    role: string;
}
export const ManagerSchema = SchemaFactory.createForClass(Manager);
