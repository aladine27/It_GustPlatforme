export interface ITask extends Document { 
    
    readonly title: string;
       
    readonly description: string;
         
    readonly duration: string;
         
    readonly startDate: Date;
        
    readonly endDate: Date;
         
    readonly status: String;

    readonly project: string;

    readonly user: string;
    readonly sprint: string;


    
    }