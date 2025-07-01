import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IDocument } from './interfaces/document.interface';
import { Model,Types } from 'mongoose';
import { IUser } from 'src/users/interfaces/user.interface';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
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
  
  async findDocumentByuserId(user: string):Promise<IDocument[]> {
    const documentUser = await this.documentModel.find({user}).populate('user');
    if (!documentUser) {
      throw new NotFoundException('No document found for this user');
    }
    return documentUser;

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
  // document.service.ts
  async getDocumentTemplate(documentId: string): Promise<{ html: string }> {
    const doc = await this.documentModel.findById(documentId).populate<{ user: IUser }>('user');
    if (!doc) throw new NotFoundException('Document not found');

    // Sécurité: on caste l'utilisateur (après .populate) comme IUser
    const user = doc.user as IUser;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;background:#fff;">
        <div style="display:flex;align-items:center;gap:20px;">
          <img src="https://tonentreprise.com/logo.png" style="height:64px"/>
          <div>
            <h2 style="color:#1976d2;margin:0;">Attestation Professionnelle</h2>
            <div style="color:#888;font-size:13px;">Société Sofiatech</div>
          </div>
        </div>
        <hr style="margin:20px 0;"/>
        <p>Ce document certifie que <b>${user?.fullName ?? ""}</b> est employé(e) chez Sofiatech.</p>
        <ul>
          <li><b>Email :</b> ${user?.email ?? ""}</li>
          <li><b>Date de délivrance :</b> ${doc.delevryDate ? new Date(doc.delevryDate).toLocaleDateString("fr-FR") : new Date().toLocaleDateString("fr-FR")}</li>
          <li><b>Motif :</b> ${doc.reason}</li>
        </ul>
        <div style="margin-top:30px;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://tonentreprise.com/doc/${doc._id}" />
        </div>
        <div style="margin-top:48px;display:flex;gap:30px;">
          <div>
            <img src="https://tonentreprise.com/signature.png" style="height:40px;"/>
            <div style="font-size:14px;">RH</div>
          </div>
          <div>
            <img src="https://tonentreprise.com/tampon.png" style="height:40px;"/>
          </div>
        </div>
      </div>
    `;
    return { html };
  }
  async generatePdfFromHtml(documentId: string, html: string): Promise<IDocument> {
    const doc = await this.documentModel.findById(documentId);
    if (!doc) throw new NotFoundException('Document not found');

    const outputDir = path.join(process.cwd(), 'uploads', 'documents');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const fileName = `doc_${doc._id}_${Date.now()}.pdf`;
    const filePath = path.join(outputDir, fileName);

    // Ici la correction : headless:true (et pas "new")
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "15px", right: "15px" },
    });
    await browser.close();

    // Correction : il ne doit PAS être readonly/immutable
    (doc as any).file = fileName;
    await doc.save();

    return doc;
  }


}
