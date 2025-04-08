import { Document } from "mongoose";

export interface IFraisAdvantage extends Document {
  
       readonly raison: string;
       
       readonly file: string;
             
       readonly status: string;

       readonly fraiType: string;
       readonly user: string;

}