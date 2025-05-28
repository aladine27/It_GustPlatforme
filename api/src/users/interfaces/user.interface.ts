export interface IUser extends Document {

       readonly _id:string;
  
       readonly fullName: string;
       
       readonly email: string;
             
       readonly password: string;
      
       readonly image: string;
       
       readonly phone: string;
       
       readonly role: string;
        
       readonly address: string;
       
       readonly createdAt: Date;
       

}