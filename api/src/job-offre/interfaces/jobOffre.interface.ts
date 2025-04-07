export interface IJobOffre extends Document {
  
       
          name: string;
         
          description : string;
      
          file :  string; 
          
          email: string;
          
          dateDebut: Date; 
          
          dateFin: Date;
          
          status : string;
          
          requirements: string;
          
          work_mode: string;



}