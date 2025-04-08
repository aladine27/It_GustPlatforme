import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IDocument } from './interfaces/document.interface';
import { Model } from 'mongoose';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class DocumentService {
  constructor(@InjectModel('documents')private documentModel: Model<IDocument>,
             @InjectModel('users') private userModel: Model<IUser>
) {}
  
  async create(createDocumentDto: CreateDocumentDto):Promise<IDocument> {
    const newDocument = new this.documentModel(createDocumentDto);
    await this.userModel.updateOne({_id:createDocumentDto.user},{$push:{documents:newDocument._id}})
    return newDocument.save();
  }

  async findAll():Promise<IDocument[]> {
    const documents = await this.documentModel.find();
    if(!documents || documents.length === 0){ 
      throw new NotFoundException('No document found')
    }
    return documents;
  }

  async findOne(id: string):Promise<IDocument> {
    const document = await this.documentModel.findById(id);
    if(!document){
      throw new NotFoundException('No document found')

    }
    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto):Promise<IDocument> {
    const document = await this.documentModel.findByIdAndUpdate(id, updateDocumentDto, {new: true});
    if(!document){
      throw new NotFoundException('No document found')
      
    }
    return document;
  }

  async remove(id: string):Promise<IDocument> {
    const document = await this.documentModel.findByIdAndDelete(id);
    if (!document) {
      throw new NotFoundException('No document found');
    }
    await this.userModel.updateOne({_id:document.user},{$pull:{documents:document._id}})
    return document;
  
  }
}
