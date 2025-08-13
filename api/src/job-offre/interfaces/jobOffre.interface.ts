export interface IJobOffre extends Document {
  
       
          readonly title: string;
         
          readonly description : string;
                 
          readonly postedDate: Date; 
          
          readonly closingDate: Date;
          
          readonly status : string;
          
          readonly requirements: string;
          
          readonly jobCategory: string;
          
          readonly type :string;

          readonly salaryRange:number;

          readonly bonuses: string;

          readonly user: string;

}