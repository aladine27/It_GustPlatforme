export interface ISprint extends Document {
  readonly title: string;
  readonly status: string;
  readonly duration?: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly project: string;
  readonly teams: string[];
   readonly tasks: string[];
}
