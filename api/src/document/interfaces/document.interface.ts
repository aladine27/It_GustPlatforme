export interface IDocument extends Document {
  
    readonly title: string;
    readonly delevryDate: Date;
    readonly traitementDateLimite: Date;
    readonly status: string;
    readonly reason: string;
    readonly user: string;
    readonly documentType: string;
    file: string
    
    
  
       
      


}