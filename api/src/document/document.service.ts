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
    const user = doc.user as IUser;
    const type = (doc.title || "").toLowerCase();

    let html: string;

    switch (type) {
      case "attestation de travail":
        html = `
          <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;background:#fff;">
            <div style="display:flex;align-items:center;gap:20px;">
              <img src="https://tonentreprise.com/logo.png" style="height:64px"/>
              <div>
                <h2 style="color:#1976d2;margin:0;">Attestation de travail</h2>
                <div style="color:#888;font-size:13px;">Société Sofiatech</div>
              </div>
            </div>
            <hr style="margin:20px 0;"/>
            <p>
              Nous attestons que <b>${user?.fullName ?? ""}</b> est employé(e) par Sofiatech
              en qualité de <b>...</b> depuis le <b>...</b>.
            </p>
            <ul>
              <li><b>Email :</b> ${user?.email ?? ""}</li>
              <li><b>Adresse :</b> ${user?.address ?? ""}</li>
              <li><b>Téléphone :</b> ${user?.phone ?? ""}</li>
              <li><b>Raison :</b> ${doc.reason ?? ""}</li>
              <li><b>Date de délivrance :</b> ${doc.delevryDate ? new Date(doc.delevryDate).toLocaleDateString("fr-FR") : "..."}</li>
            </ul>
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
        break;
      case "bulletin de paie":
        html = `
          <div style="font-family:Arial,sans-serif;max-width:740px;margin:auto;background:#fff;padding:36px;">
            <div style="display:flex;align-items:center;gap:20px;">
              <img src="https://tonentreprise.com/logo.png" style="height:48px"/>
              <div>
                <h2 style="color:#1976d2;margin:0;">Bulletin de Paie</h2>
                <div style="color:#888;font-size:13px;">Société Sofiatech</div>
              </div>
            </div>
            <hr style="margin:16px 0 24px;"/>
            <div>
              <b>Nom :</b> ${user?.fullName ?? ""}<br/>
              <b>Période :</b> ...<br/>
              <b>Salaire Net :</b> ... TND
            </div>
            <div style="margin-top:24px;">
              <img src="https://tonentreprise.com/tampon.png" style="height:40px;"/>
              <div style="font-size:14px;">Service Paie</div>
            </div>
          </div>
        `;
        break;
      case "attestation de salaire":
        html = `
          <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;background:#fff;">
            <div style="display:flex;align-items:center;gap:20px;">
              <img src="https://tonentreprise.com/logo.png" style="height:64px"/>
              <div>
                <h2 style="color:#1976d2;margin:0;">Attestation de salaire</h2>
                <div style="color:#888;font-size:13px;">Société Sofiatech</div>
              </div>
            </div>
            <hr style="margin:20px 0;"/>
            <p>
              Nous soussignés, attestons que <b>${user?.fullName ?? ""}</b> perçoit un salaire mensuel net de 
              <b>...</b> TND chez Sofiatech, pour la période de <b>...</b>.
            </p>
            <ul>
              <li><b>Email :</b> ${user?.email ?? ""}</li>
              <li><b>Adresse :</b> ${user?.address ?? ""}</li>
              <li><b>Téléphone :</b> ${user?.phone ?? ""}</li>
              <li><b>Raison :</b> ${doc.reason ?? ""}</li>
              <li><b>Date de délivrance :</b> ${doc.delevryDate ? new Date(doc.delevryDate).toLocaleDateString("fr-FR") : "..."}</li>
            </ul>
            <div style="margin-top:36px;">
              <img src="https://tonentreprise.com/signature.png" style="height:40px;"/>
              <div style="font-size:14px;">Direction Administrative</div>
            </div>
          </div>
        `;
        break;
      case "attestation de présence":
        html = `
          <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;background:#fff;">
            <div style="display:flex;align-items:center;gap:20px;">
              <img src="https://tonentreprise.com/logo.png" style="height:48px"/>
              <div>
                <h2 style="color:#1976d2;margin:0;">Attestation de présence</h2>
                <div style="color:#888;font-size:13px;">Société Sofiatech</div>
              </div>
            </div>
            <hr style="margin:16px 0 24px;"/>
            <p>
              Nous attestons que <b>${user?.fullName ?? ""}</b> était bien présent(e) à son poste le 
              <b>${doc.delevryDate ? new Date(doc.delevryDate).toLocaleDateString("fr-FR") : "..."}</b>.
            </p>
            <ul>
              <li><b>Email :</b> ${user?.email ?? ""}</li>
              <li><b>Adresse :</b> ${user?.address ?? ""}</li>
              <li><b>Téléphone :</b> ${user?.phone ?? ""}</li>
              <li><b>Raison :</b> ${doc.reason ?? ""}</li>
            </ul>
            <div style="margin-top:36px;">
              <img src="https://tonentreprise.com/tampon.png" style="height:40px;"/>
              <div style="font-size:14px;">Service RH</div>
            </div>
          </div>
        `;
        break;
      case "certificat de non-salaire":
        html = `
          <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;background:#fff;">
            <div style="display:flex;align-items:center;gap:20px;">
              <img src="https://tonentreprise.com/logo.png" style="height:64px"/>
              <div>
                <h2 style="color:#1976d2;margin:0;">Certificat de non-salaire</h2>
                <div style="color:#888;font-size:13px;">Société Sofiatech</div>
              </div>
            </div>
            <hr style="margin:20px 0;"/>
            <p>
              Nous certifions que <b>${user?.fullName ?? ""}</b> n'a perçu aucun salaire pour la période de 
              <b>...</b> au sein de Sofiatech.
            </p>
            <ul>
              <li><b>Email :</b> ${user?.email ?? ""}</li>
              <li><b>Adresse :</b> ${user?.address ?? ""}</li>
              <li><b>Téléphone :</b> ${user?.phone ?? ""}</li>
              <li><b>Raison :</b> ${doc.reason ?? ""}</li>
              <li><b>Date de délivrance :</b> ${doc.delevryDate ? new Date(doc.delevryDate).toLocaleDateString("fr-FR") : "..."}</li>
            </ul>
            <div style="margin-top:36px;">
              <img src="https://tonentreprise.com/signature.png" style="height:40px;"/>
              <div style="font-size:14px;">Direction Administrative</div>
            </div>
          </div>
        `;
        break;
      default:
        html = `
          <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;background:#fff;">
            <div style="display:flex;align-items:center;gap:20px;">
              <img src="https://tonentreprise.com/logo.png" style="height:64px"/>
              <div>
                <h2 style="color:#1976d2;margin:0;">Document administratif</h2>
                <div style="color:#888;font-size:13px;">Société Sofiatech</div>
              </div>
            </div>
            <hr style="margin:20px 0;"/>
            <p>
              Document généré pour <b>${user?.fullName ?? ""}</b>.<br/>
              Délivré le ${doc.delevryDate ? new Date(doc.delevryDate).toLocaleDateString("fr-FR") : "..."}.
            </p>
          </div>
        `;
    }
    return { html };
  }

  async generatePdfFromHtml(documentId: string, html: string): Promise<IDocument> {
    const doc = await this.documentModel.findById(documentId);
    if (!doc) throw new NotFoundException('Document not found');

    const outputDir = path.join(process.cwd(), 'uploads', 'documents');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const fileName = `doc_${doc._id}_${Date.now()}.pdf`;
    const filePath = path.join(outputDir, fileName);

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

    (doc as any).file = fileName;
    await doc.save();

    return doc;
  }



}