import { Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: true})
export class Admin {
    role:string;
}
export const AdminSchema = SchemaFactory.createForClass(Admin);


