export interface ITask extends Document { 
    
    readonly title: string;
       
    readonly description: string;
         
    readonly status: String;
    
    readonly priority: string; 

    readonly project: string;

    readonly user: string;
    readonly sprint: string;


    
    }