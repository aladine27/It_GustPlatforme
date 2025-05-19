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
@Injectable()
export class UsersService {
  constructor(@InjectModel('users') private userModel: Model<IUser>,private readonly configService: ConfigService) {}

  

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
      // Envoi de l'email après la création
      await this.sendAccountCreationEmail(user.email, user.fullName, plainPassword);

    return user;

  
  }

  async sendAccountCreationEmail(email: string, fullName: string, password: string) {
    console.log('[Mail] Preparing to send email');

    const apiKey = this.configService.get<string>('SENDINBLUE');
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

    try {
      await sendinblue.sendTransacEmail(emailParams);
      console.log('[Mail] Email envoyé avec succès à', email);
    } catch (error) {
      console.error('[Mail] Erreur lors de l’envoi de l’email :', error);
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
  
    
}
