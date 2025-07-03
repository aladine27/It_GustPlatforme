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
  
  async getDocumentTemplate(documentId: string): Promise<{ html: string }> {
    const doc = await this.documentModel.findById(documentId).populate<{ user: IUser }>('user');
    if (!doc) throw new NotFoundException('Document not found');
    const user = doc.user as IUser;
    const type = (doc.title || "").toLowerCase();
  
    let html: string;
    switch (type) {
      case "bulletin de paie":
        html = `
          <p><img src="https://tonentreprise.com/logo.png" /></p>
          <h2>Bulletin de Paie</h2>
          <p>Société Sofiatech</p>
          <hr/>
          <p><b>Nom du salarié :</b> ${user?.fullName ?? ""}</p>
          <p><b>Période concernée :</b> ...</p>
          <p><b>Salaire Net à payer :</b> ... TND</p>
          <p>
            Ce bulletin de paie certifie la rémunération due au salarié pour la période indiquée ci-dessus.<br>
            Veuillez vérifier l’exactitude des informations indiquées.<br>
            <i>Pour toute question relative à ce bulletin, merci de contacter le service paie.</i>
          </p>
          <p><img src="https://tonentreprise.com/tampon.png" /></p>
          <p>Service Paie - Sofiatech</p>
        `;
        break;
  
      case "attestation de salaire":
        html = `
          <p><img src="https://tonentreprise.com/logo.png" /></p>
          <h2>Attestation de Salaire</h2>
          <p>Société Sofiatech</p>
          <hr/>
          <p>
            Nous, soussignés, attestons par la présente que <b>${user?.fullName ?? ""}</b> est employé(e) chez Sofiatech et perçoit un salaire mensuel net de <b>...</b> TND,
            pour la période de <b>...</b>.
          </p>
          <ul>
            <li><b>Email :</b> ${user?.email ?? ""}</li>
            <li><b>Adresse :</b> ${user?.address ?? ""}</li>
            <li><b>Téléphone :</b> ${user?.phone ?? ""}</li>
            <li><b>Motif de la demande :</b> ${doc.reason ?? ""}</li>
            <li><b>Date de délivrance :</b> ${doc.delevryDate ? new Date(doc.delevryDate).toLocaleDateString("fr-FR") : "..."}</li>
          </ul>
          <p>
            Cette attestation est délivrée à la demande de l’intéressé(e) pour servir et valoir ce que de droit.
          </p>
          <p><img src="https://tonentreprise.com/signature.png" /></p>
          <p>Direction Administrative - Sofiatech</p>
        `;
        break;
  
        case "attestation de présence":
          html = `
            <p><img src="https://tonentreprise.com/logo.png" /></p>
            <p><b>Attestation de Présence</b></p>
            <p>Société Sofiatech</p>
            <p>Nous attestons que <b>${user?.fullName ?? ""}</b> a effectivement été présent(e) à son poste le <b>${doc.delevryDate ? new Date(doc.delevryDate).toLocaleDateString("fr-FR") : "..."}</b>, au sein de notre société.</p>
            <ul>
              <li><b>Email :</b> ${user?.email ?? ""}</li>
              <li><b>Adresse :</b> ${user?.address ?? ""}</li>
              <li><b>Téléphone :</b> ${user?.phone ?? ""}</li>
              <li><b>Motif de la demande :</b> ${doc.reason ?? ""}</li>
            </ul>
            <p>Fait pour servir et valoir ce que de droit.</p>
            <p><img src="https://tonentreprise.com/tampon.png" /></p>
            <p>Service RH - Sofiatech</p>
          `;
          break;
      
  
      case "certificat de non-salaire":
        html = `
          <p><img src="https://tonentreprise.com/logo.png" /></p>
          <h2>Certificat de Non-Salaire</h2>
          <p>Société Sofiatech</p>
          <hr/>
          <p>
            Nous certifions que <b>${user?.fullName ?? ""}</b> n’a perçu aucun salaire pour la période de <b>...</b> au sein de notre entreprise.
          </p>
          <ul>
            <li><b>Email :</b> ${user?.email ?? ""}</li>
            <li><b>Adresse :</b> ${user?.address ?? ""}</li>
            <li><b>Téléphone :</b> ${user?.phone ?? ""}</li>
            <li><b>Motif de la demande :</b> ${doc.reason ?? ""}</li>
            <li><b>Date de délivrance :</b> ${doc.delevryDate ? new Date(doc.delevryDate).toLocaleDateString("fr-FR") : "..."}</li>
          </ul>
          <p>
            Délivré à la demande de l’intéressé(e) pour servir et valoir ce que de droit.
          </p>
          <p><img src="https://tonentreprise.com/signature.png" /></p>
          <p>Direction Administrative - Sofiatech</p>
        `;
        break;
  
      default:
        html = `
          <p><img src="https://tonentreprise.com/logo.png" /></p>
          <h2>Document Administratif</h2>
          <p>Société Sofiatech</p>
          <hr/>
          <p>
            Ce document a été généré pour <b>${user?.fullName ?? ""}</b>.<br/>
            Délivré le ${doc.delevryDate ? new Date(doc.delevryDate).toLocaleDateString("fr-FR") : "..."}.
          </p>
          <p>
            Pour toute information complémentaire, merci de contacter notre service RH.
          </p>
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