import { Document } from 'mongoose';

export interface ITeam extends Document {
  readonly title: string;
  readonly employeeList: string[];
  readonly project: string;
}
