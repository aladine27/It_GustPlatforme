import { Document } from "mongoose";

export interface IApplicationAnalysis extends Document {
  readonly filename: string;
  readonly email: string;
  readonly skills: string[];
  readonly scoreIA: number;
}
