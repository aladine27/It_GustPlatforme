export interface IUser extends Document {

       readonly _id:string;
  
       readonly fullName: string;
       
       readonly email: string;
             
       readonly password: string;
      
       readonly image: string;
       
       readonly phone: string;
       
       readonly Role: string;
        
       readonly address: string;
       



}