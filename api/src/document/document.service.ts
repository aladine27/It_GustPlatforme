import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IDocument } from './interfaces/document.interface';
import { Model } from 'mongoose';
import { IUser } from 'src/users/interfaces/user.interface';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel('documents') private documentModel: Model<IDocument>,
    @InjectModel('users') private userModel: Model<IUser>
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<IDocument> {
    const newDocument = new this.documentModel(createDocumentDto);
    await this.userModel.updateOne(
      { _id: createDocumentDto.user },
      { $push: { documents: newDocument._id } }
    );
    return newDocument.save();
  }

  async findDocumentByuserId(user: string): Promise<IDocument[]> {
    const documentUser = await this.documentModel.find({ user }).populate('user');
    if (!documentUser) {
      throw new NotFoundException('No document found for this user');
    }
    return documentUser;
  }

  async findAll(): Promise<IDocument[]> {
    const documents = await this.documentModel.find().populate('user');
    if (!documents || documents.length === 0) {
      throw new NotFoundException('No document found');
    }
    return documents;
  }

  async findOne(id: string): Promise<IDocument> {
    const document = await this.documentModel.findById(id).populate('user');
    if (!document) {
      throw new NotFoundException('No document found');
    }
    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<IDocument> {
    const document = await this.documentModel.findByIdAndUpdate(id, updateDocumentDto, { new: true });
    if (!document) {
      throw new NotFoundException('No document found');
    }
    return document;
  }

  async remove(id: string): Promise<IDocument> {
    const document = await this.documentModel.findByIdAndDelete(id);
    if (!document) {
      throw new NotFoundException('No document found');
    }
    await this.userModel.updateOne({ _id: document.user }, { $pull: { documents: document._id } });
    return document;
  }

  async getDocumentTemplate(documentId: string): Promise<{ html: string }> {
    const doc = await this.documentModel.findById(documentId).populate<{ user: any }>('user');
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      // Format court : 12/06/2025
      return date.toLocaleDateString("fr-FR");
      // Format long : 12 juin 2025
      // return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
    };
    if (!doc) throw new NotFoundException('Document not found');
    const user = doc.user as any;
    const type = (doc.title || "").toLowerCase();
  
    // Helper pour afficher un champ ou un aide-texte
    const F = (val: any, label?: string) =>
      val !== undefined && val !== null && val !== ""
        ? val
        : `<span style="color:#2874c9; font-style:italic;">[À remplir&nbsp;: ${label ?? "informations manquantes"}]</span>`;
  
    // HEADER HTML
    const headerHtml = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div style="font-weight:700;font-size:22px;color:#223a67;margin-bottom:4px;letter-spacing:1px;">
            ${F(null, "Nom de l'entreprise")}
          </div>
          <div style="color:#7d7e84;font-size:15px;">
            ${F(null, "Adresse de l'entreprise")}<br/>
            ${F(null, "Code postal")}
          </div>
        </div>
        <div style="text-align:right;">
          <div style="margin-top:12px;font-weight:700;color:#223a67;">
            ${F(null, "Ville de signature")}, le ${doc.delevryDate ? new Date(doc.delevryDate).toLocaleDateString("fr-FR") : F(null, "Date de signature")}
          </div>
        </div>
      </div>
    `;
  
    // FOOTER HTML (AVEC UN PLACEHOLDER SIMPLE "Signature" + [Signature RH])
    const footerHtml = `
    <div style="display: flex;width: 100%;justify-content: flex-start;align-items: flex-end;margin-top: 38px;">
      <div style="display: flex;flex-direction: row;gap: 38px;align-items: flex-end;background: #f8faff;border-radius: 14px;box-shadow: 0 2px 12px #e0e9f9;padding: 20px 30px 18px 32px;min-width: 490px;max-width: 650px;">
        <div style="min-width: 210px; text-align: left;">
          <b style="color: #223a67;">
            Fait à <span style="color:#2874c9;">[À remplir : Ville de signature]</span>,<br/>
            le <span style="color:#2874c9;">[À remplir : Date de signature]</span>
          </b>
          <br/><br/>
          <span style="color:#2874c9;">[À remplir : Nom et fonction du signataire]</span>
          <div style="margin-top:10px;font-size:13px;color:#677088;">
            Signature
          </div>
          <!-- Conteneur pour la signature avec styles -->
          <div id="signature-container" style="width: 150px; height: 75px; margin-top: 10px;">
            <!-- L'image de la signature sera insérée ici par le frontend -->
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top:18px;text-align:center;font-size:13px;color:#b7b7bb;letter-spacing:0.5px;">
      DOCUMENT | Généré automatiquement | ${new Date().getFullYear()}
    </div>
  `;
  
  
    // MAIN BODY
    let mainBody = '';
    let titre = '';
    const formattedDate = formatDate(user?.createdAt);
    
  
    function TitreComponent(text: string) {
      return `<div style="text-align:center;font-size:1.35em;font-weight:800;text-decoration:underline;color:#223a67;margin-bottom:22px;letter-spacing:1.2px;">${text}</div>`;
    }
  
    switch (type) {
      case "attestation de travail":
        titre = "ATTESTATION DE TRAVAIL";
        mainBody = `
          <div style="margin-bottom:12px;">Objet : Attestation de travail / ${F(user?.fullName, "Nom du salarié")}</div>
          ${TitreComponent(titre)}
          <div style="font-size:1.09em;line-height:1.75;">
            Je soussigné(e) : <b>${F(null, "Nom du signataire")}</b>, agissant en qualité de <b>RH</b>
            de la société <b>${F(null, "Nom de l'entreprise")}</b>, atteste que <b>${F(user?.fullName, "Nom du salarié")}</b>,<br/>
            demeurant <b>${F(user?.address, "Adresse du salarié")}</b>,<br/>
            - est salarié(e) depuis le <b>${F(formattedDate, "Date d'embauche")}</b>,<br/>
            - occupe actuellement le poste de <b>${F(user?.role, "Poste du salarié")}</b>.<br/><br/>
            Cette attestation lui est délivrée pour servir et valoir ce que de droit.
          </div>
        `;
        break;
  
      case "attestation de salaire":
        titre = "ATTESTATION DE SALAIRE";
        mainBody = `
          <div style="margin-bottom:12px;">Objet : Attestation de salaire / ${F(user?.fullName, "Nom du salarié")}</div>
          ${TitreComponent(titre)}
          <div style="font-size:1.09em;line-height:1.75;">
            Nous attestons que <b>${F(user?.fullName, "Nom du salarié")}</b> est employé(e) de la société <b>${F(null, "Nom de l'entreprise")}</b> depuis le <b>${F(null, "Date d'embauche")}</b>
            et perçoit un salaire mensuel net de <b>${F(null, "Salaire net")}</b> TND pour la période de <b>${F(null, "Période concernée")}</b>, en qualité de <b>${F(user?.role, "Poste du salarié")}</b>.<br/><br/>
            Cette attestation est délivrée à la demande de l'intéressé(e).
          </div>
        `;
        break;
  
      case "bulletin de paie":
        titre = "BULLETIN DE PAIE";
        mainBody = `
          <div style="margin-bottom:12px;">Objet : Bulletin de paie / ${F(user?.fullName, "Nom du salarié")}</div>
          ${TitreComponent(titre)}
          <div style="font-size:1.09em;line-height:1.75;">
            <b>Nom :</b> ${F(user?.fullName, "Nom du salarié")}<br/>
            <b>Période :</b> ${F(null, "Période concernée")}<br/>
            <b>Poste :</b> ${F(user?.role, "Poste du salarié")}<br/>
            <b>Salaire Net :</b> ${F(null, "Salaire net")} TND<br/>
            <br/>
            Bulletin émis et signé électroniquement, valable auprès de tout organisme officiel.
          </div>
        `;
        break;
  
      case "attestation de présence":
        titre = "ATTESTATION DE PRÉSENCE";
        mainBody = `
          <div style="margin-bottom:12px;">Objet : Attestation de présence / ${F(user?.fullName, "Nom du salarié")}</div>
          ${TitreComponent(titre)}
          <div style="font-size:1.09em;line-height:1.75;">
            Nous attestons que <b>${F(user?.fullName, "Nom du salarié")}</b> a été présent(e) à son poste dans l'entreprise <b>${F(null, "Nom de l'entreprise")}</b>
            le <b>${doc.delevryDate ? new Date(doc.delevryDate).toLocaleDateString("fr-FR") : F(null, "Date de présence")}</b>.<br/><br/>
            Cette attestation est délivrée à la demande de l'intéressé(e).
          </div>
        `;
        break;
  
      case "certificat d'emploi et de fonction":
        titre = "CERTIFICAT D'EMPLOI ET DE FONCTION";
        mainBody = `
          <div style="margin-bottom:12px;">Objet : Certificat d'emploi et de fonction / ${F(user?.fullName, "Nom du salarié")}</div>
          ${TitreComponent(titre)}
          <div style="font-size:1.09em;line-height:1.75;">
            Nous certifions que <b>${F(user?.fullName, "Nom du salarié")}</b> occupe le poste de <b>${F(user?.role, "Poste du salarié")}</b> au sein de la société <b>${F(null, "Nom de l'entreprise")}</b>
            depuis le <b>${F(null, "Date d'embauche")}</b>.<br/><br/>
            Ce certificat est délivré à la demande de l'intéressé(e), pour servir et valoir ce que de droit.
          </div>
        `;
        break;
  
      default:
        titre = "DOCUMENT ADMINISTRATIF";
        mainBody = `
          <div style="margin-bottom:12px;">Objet : Document administratif / ${F(user?.fullName, "Nom du salarié")}</div>
          ${TitreComponent(titre)}
          <div style="font-size:1.09em;line-height:1.75;">
            Document généré pour <b>${F(user?.fullName, "Nom du salarié")}</b>, délivré le ${doc.delevryDate ? new Date(doc.delevryDate).toLocaleDateString("fr-FR") : F(null, "Date de génération")}.
          </div>
        `;
    }
  
    // TEMPLATE FINAL
    return {
      html: `
        <div style="
          font-family:'Segoe UI',Arial,sans-serif;
          background:#fff;
          max-width:800px;
          margin:38px auto 30px auto;
          border-radius:18px;
          box-shadow:0 4px 22px #b3c2db22;
          padding:48px 42px 34px 42px;
          border:1.5px solid #dbe8fa;
        ">
          ${headerHtml}
          <hr style="margin:28px 0 20px 0;border:0;border-top:1px solid #e4e4e4;"/>
          ${mainBody}
          ${footerHtml}
        </div>
      `
    };
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
    (doc as any).delevryDate = new Date();
    (doc as any).status = 'Génerated';

    await doc.save();
    return doc;
  }
}
