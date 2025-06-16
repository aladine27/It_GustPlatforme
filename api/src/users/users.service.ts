import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { randomBytes } from 'crypto';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';
import axios from 'axios';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UsersService {
  
  constructor(@InjectModel('users') private userModel: Model<IUser>,private readonly configService: ConfigService) {}
  isVirtualEmail(email: string): boolean {
    return (
      email.endsWith('@smtp.dev') ||
      email.endsWith('@mail.tm') ||
      email.endsWith('@test.tn')
    );
  }
  
  
  async generateRandomPassword():Promise<string> {
    const randomBytesPromise = new Promise<string>((resolve, reject) => {
      randomBytes(8, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer.toString('hex'));
        }
      });
    });
    return randomBytesPromise;
  }

  async create(createUserDto: CreateUserDto): Promise<IUser>  {
  
    const plainPassword =  await this.generateRandomPassword();
    console.log('Generated password:', plainPassword);  
    const newUser = new this.userModel({
      ...createUserDto,
      password: plainPassword,
    });
   
    const user = await newUser.save();
    console.log('[CREATE USER] User enregistré en BDD :', user.email);
      // Envoi de l'email après la création
      await this.sendAccountCreationEmail(user.email, user.fullName, plainPassword);

    return user;

  
  }

  async sendAccountCreationEmail(email: string, fullName: string, password: string) {
    console.log('[Mail] Preparing to send email');
  
    if (this.isVirtualEmail(email)) {
      // Envoi avec Mailtrap
      try {
        const transporter = nodemailer.createTransport({
          host: 'sandbox.smtp.mailtrap.io', // ou celui affiché dans ton dashboard Mailtrap
          port: 2525, // ou celui fourni
          auth: {
            user: this.configService.get<string>('MAILTRAP_USER'), // à mettre dans .env !
            pass: this.configService.get<string>('MAILTRAP_PASS'), // à mettre dans .env !
          },
        });
  
        await transporter.sendMail({
          from: '"Plateforme ITGust" <noreply@itg.com>',
          to: email,
          subject: 'Bienvenue sur notre plateforme (TEST)',
          html: `
            <h3>Bonjour ${fullName},</h3>
            <p>Votre compte a été créé avec succès.</p>
            <p>Voici vos informations de connexion :</p>
            <ul>
              <li>Email : <strong>${email}</strong></li>
              <li>Mot de passe : <strong>${password}</strong></li>
            </ul>
            <p>Vous pouvez changer votre mot de passe après connexion.</p>
          `,
        });
  
        console.log('[Mail] Email virtuel envoyé via Mailtrap à', email);
      } catch (error) {
        console.error('[Mail] Erreur lors de l’envoi via Mailtrap :', error);
      }
      return;
    }
  
    // ----- Email réel (Sendinblue)
    try {
      const apiKey = this.configService.get<string>('SENDINBLUE_API_KEY');
      const defaultClient = SibApiV3Sdk.ApiClient.instance;
      const apiKeyAuth = defaultClient.authentications['api-key'];
      apiKeyAuth.apiKey = apiKey;
  
      const sendinblue = new SibApiV3Sdk.TransactionalEmailsApi();
  
      const emailParams: SibApiV3Sdk.SendSmtpEmail = {
        sender: { name: 'Plateforme ITGust', email: 'noreply@itg.com' },
        to: [{ email, name: fullName }],
        subject: 'Bienvenue sur notre plateforme',
        htmlContent: `
          <h3>Bonjour ${fullName},</h3>
          <p>Votre compte a été créé avec succès.</p>
          <p>Voici vos informations de connexion :</p>
          <ul>
            <li>Email : <strong>${email}</strong></li>
            <li>Mot de passe : <strong>${password}</strong></li>
          </ul>
          <p>Vous pouvez changer votre mot de passe après connexion.</p>
        `,
      };
  
      await sendinblue.sendTransacEmail(emailParams);
      console.log('[Mail] Email réel envoyé avec succès à', email);
    } catch (error) {
      console.error('[Mail] Erreur lors de l’envoi du mail réel :', error);
    }
  }
  


  

  async findAll():Promise<IUser[]> {
    const users = await this.userModel.find()
    if(!users || users.length === 0){ 
      throw new NotFoundException('No user found')
    }
    return users;

    }

 async findOne(id: string):Promise<IUser> {
  const user = await this.userModel.findById(id)
  if(!user){ 
      throw new NotFoundException('No user found')
    }
    return user
  }
  async findbyEmail(email:string):Promise<IUser>  {
    const userEmail = await this.userModel.findOne({email})
    if(!userEmail){ 
      throw new NotFoundException('No userEmail found')
    }
    return userEmail
  }
  async findUserByRole(role:string):Promise<IUser[]> {
    const users = await this.userModel.find({role})
    if(!users || users.length === 0){ 
      throw new NotFoundException('No users for this role found')
    }
    return users;
  }

 async update(id: string, updateUserDto: UpdateUserDto):Promise<IUser> {
  
  const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true})
  if(!user){ 
      throw new NotFoundException('No user found')
    }
  
    return user;
  }

  async remove(id: string):Promise<IUser> {
    const user = await this.userModel.findByIdAndDelete(id);
     if(!user){ 
      throw new NotFoundException('No user found')
    }
  
    return user;
  
  }
  
  async fetchUsersByDateRange(startDate?: Date, endDate?: Date): Promise<IUser[]> {
    const filter: any = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        // début de la journée locale
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = start;
      }
      if (endDate) {
        // fin de la journée locale
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }
    console.log("[fetchUsersByDateRange] Filtre utilisé :", filter);
    const users = await this.userModel.find(filter);
    console.log("[fetchUsersByDateRange] Users trouvés :", users.length);
    if (!users || users.length === 0) {
      throw new NotFoundException('Aucun utilisateur trouvé pour ce filtre');
    }
    return users;
  }
  
  
  async exportUsersToPdf(startDate?: Date, endDate?: Date): Promise<Buffer> {
    const users = await this.fetchUsersByDateRange(startDate, endDate);
   // AJOUTE CE LOG :
   console.log("[EXPORT PDF] Nb users exportés :", users.length, users.map(u => u.fullName));

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const buffers: Buffer[] = [];
    doc.on('data', chunk => buffers.push(chunk));
    const endPromise = new Promise<Buffer>(resolve =>
      doc.on('end', () => resolve(Buffer.concat(buffers))),
    );
  
    // 1. TITRE ET PÉRIODE
    doc
      .fontSize(18).fillColor('#1976D2').font('Helvetica-Bold')
      .text('Liste des utilisateurs', { align: 'center' })
      .moveDown(0.5)
      .fontSize(12).fillColor('black').font('Helvetica')
      .text(
        `Période : ${startDate?.toISOString().split('T')[0] || '∞'} → ${endDate?.toISOString().split('T')[0] || '∞'}`,
        { align: 'center' },
      )
      .moveDown(1);
  
    // 2. TABLEAU (entêtes + lignes)
    const headers = ['Nom complet', 'Email', 'Téléphone', 'Rôle', 'Date de création'];
    const colWidths = [120, 170, 90, 70, 90];
    const rowHeight = 26;
    const startX = doc.page.margins.left;
    let y = doc.y + 10;
  
    // Helper: dessine une cellule (bordure + texte)
    function drawCell(
      doc: PDFKit.PDFDocument,
      text: string,
      x: number,
      y: number,
      width: number,
      height: number,
      options: { header?: boolean, align?: 'left' | 'center' | 'right' } = {}
    ) {
      doc.rect(x, y, width, height).strokeColor('#cfd8dc').lineWidth(0.7).stroke();
      doc
        .fillColor(options.header ? '#1976D2' : 'black')
        .font(options.header ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(options.header ? 12 : 11)
        .text(text, x + 4, y + 7, {
          width: width - 8,
          align: options.align || 'left',
          continued: false,
          lineBreak: false,
        });
    }
    
  
    // En-têtes avec fond coloré
    let x = startX;
    doc.save();
    headers.forEach((header, i) => {
      // Fond bleu clair
      doc.rect(x, y, colWidths[i], rowHeight).fillAndStroke('#e3f2fd', '#90caf9');
      // Texte
      drawCell(doc, header, x, y, colWidths[i], rowHeight, { header: true, align: 'center' });
      x += colWidths[i];
    });
    doc.restore();
    y += rowHeight;
  
    // Lignes des utilisateurs (alternance couleurs)
    users.forEach((u, idx) => {
      let xRow = startX;
      const cells = [
        u.fullName || '',
        u.email || '',
        u.phone || '',
        u.role || '',
        u.createdAt ? u.createdAt.toISOString().split('T')[0] : '',
      ];
      // Alternance fond gris très clair pour meilleure lisibilité
      if (idx % 2 === 1) {
        doc.rect(xRow, y, colWidths.reduce((a, b) => a + b, 0), rowHeight).fill('#f6f7fb');
      }
      cells.forEach((cell, i) => {
        drawCell(doc, cell, xRow, y, colWidths[i], rowHeight, { align: i === 1 ? 'left' : 'center' });
        xRow += colWidths[i];
      });
      y += rowHeight;
  
      // Nouvelle page si besoin
      if (y > doc.page.height - doc.page.margins.bottom - rowHeight * 2) {
        doc.addPage();
        y = doc.page.margins.top + 10;
        // Redessiner l’entête sur nouvelle page
        let xNew = startX;
        doc.save();
        headers.forEach((header, i) => {
          doc.rect(xNew, y, colWidths[i], rowHeight).fillAndStroke('#e3f2fd', '#90caf9');
          drawCell(doc, header, xNew, y, colWidths[i], rowHeight, { header: true, align: 'center' });
          xNew += colWidths[i];
        });
        doc.restore();
        y += rowHeight;
      }
    });
  
    doc.end();
    return endPromise;
  }
  
    async exportUsersToExcel(startDate?: Date,endDate?: Date): Promise<Buffer> {
      const users = await this.fetchUsersByDateRange(startDate, endDate);
        // AJOUTE CE LOG :
  console.log("[EXPORT EXCEL] Nb users exportés :", users.length, users.map(u => u.fullName));

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Users');
  
      sheet.columns = [
        { header: 'ID', key: '_id', width: 24 },
        { header: 'Nom complet', key: 'fullName', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Téléphone', key: 'phone', width: 20 },
        { header: 'Rôle', key: 'role', width: 15 },
        { header: 'Créé le', key: 'createdAt', width: 20 },
      ];
  
      users.forEach(user => {
        sheet.addRow({
          _id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt.toISOString().split('T')[0],
        });
      });
  
      const arrayBuffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(arrayBuffer);


    }
    async searchUsers(query: string): Promise<IUser[]> {
      const regex = new RegExp(query, 'i'); // i = insensitive
      const users = await this.userModel.find({
        $or: [
          { fullName: regex },
          { email: regex },
          { address: regex },
          { phone: regex },
          { role: regex
           },
           { domain: regex
           },
           

        ],
      });
  
      if (!users || users.length === 0) {
        throw new NotFoundException('Aucun utilisateur correspondant trouvé');
      }
  
      return users;
    }
    // users.service.js
   

    async importUsersFromExcel(fileBuffer: Buffer): Promise<IUser[]> {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(fileBuffer);
    
      const worksheet = workbook.worksheets[0];
      const created: IUser[] = [];
      const userPromises: Promise<void>[] = [];
    
      console.log("[IMPORT EXCEL] Nombre de lignes (avec header):", worksheet.rowCount);
    
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // skip header
    
        // Modifie ici l'ordre si besoin, selon ton fichier Excel
        // [_id, fullName, email, phone, role, address, image, domain]
        const [_, fullName, email, phone, role, address, image, domain] = row.values as any[];
        console.log(`[IMPORT EXCEL] Row ${rowNumber} :`, { fullName, email, phone, role, address, image, domain });
    
        if (!fullName || !email || !role) {
          console.log(`[IMPORT EXCEL] Ligne ${rowNumber} ignorée (champ obligatoire manquant)`);
          return;
        }
    
        let phoneValue: number | undefined;
        if (phone !== undefined && phone !== null && String(phone).trim() !== '') {
          phoneValue = Number(phone);
          if (isNaN(phoneValue)) {
            console.log(`[IMPORT EXCEL] Ligne ${rowNumber} ignorée (téléphone invalide):`, phone);
            return;
          }
        }
        let parsedEmail = typeof email === 'object' && email !== null && 'text' in email
          ? email.text
          : email;
    
        const userDto: CreateUserDto = {
          fullName: String(fullName),
          email: String(parsedEmail),
          phone: Number(phoneValue),
          role: String(role),
          address: address ? String(address) : "",
          password: "",
          image: (!image || image === "null" || image === null) ? "" : String(image),          // Correction ici
          domain: domain ? String(domain) : "", // Correction pour domain si tu as la colonne
        };
        console.log(`[IMPORT EXCEL] Création user :`, userDto);
    
        userPromises.push(
          this.create(userDto)
            .then(user => {
              console.log(`[IMPORT EXCEL] User ajouté à la BDD:`, user.email);
              created.push(user);
            })
            .catch(e => {
              console.error(`[IMPORT EXCEL] Erreur création user ligne ${rowNumber} :`, e.message);
            })
        );
      });
    
      await Promise.all(userPromises);
    
      console.log(`[IMPORT EXCEL] Utilisateurs créés :`, created.map(u => u.email));
      return created;
    }
    
    
    
}
