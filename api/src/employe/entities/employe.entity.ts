import { Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Employe {
    role:string;
}
export const EmployeSchema = SchemaFactory.createForClass(Employe);
