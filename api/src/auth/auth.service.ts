import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import {createLoginDto} from './dto/creat-login.dto'
import * as   argon2  from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import {v4 as uuidv4} from 'uuid'
import { randomBytes } from 'crypto';
import axios from 'axios';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
@Injectable()
export class AuthService {
    constructor(private userService:UsersService,
        private jwtService:JwtService,
        private configService:ConfigService,
    ){}
    async signIn(CreateLoginDto:createLoginDto){
        const user = await this.userService.findbyEmail(CreateLoginDto.email)
        if (!user){
            throw new BadRequestException("user not exist")
        }
        const passwordMatches= await argon2.verify(user.password,CreateLoginDto.password);
      
        if (!passwordMatches){
            throw new BadRequestException("password incorrect")
        }
       const token = await this.generateToken(user._id, user.email, user.role);
        await this.updateRefreshToken(user._id,token.refreshToken)
        return {user , token}
    }
    async generateToken(userId:string,email:string, role:string){
        const [accessToken, refreshToken]=await Promise.all([
            this.jwtService.signAsync(
                {
                    sub:userId,
                    email,
                    role
                },
                {
                    secret:this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
                    expiresIn:'1d'
                }
            ),
            this.jwtService.signAsync(
                {
                    sub:userId,
                    email,
                    role
                },
                {
                    secret:this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
                    expiresIn:'2d'
                    
                }
            )
            

        ])
    return {accessToken, refreshToken}
    }
    async updateRefreshToken(userId: string,refreshToken: string) {
        const hashedRefreshToken = await argon2.hash(refreshToken)
        await this.userService.update(userId, {refreshToken: hashedRefreshToken})
  }
  async logout(userId: string) {
    await this.userService.update(userId, {refreshToken:null}) 
  }
  async updateprofile(userId: string, updateUserDto: UpdateUserDto) {
    const profile = await this.userService.update(userId, updateUserDto)
    if(!profile){ 
        throw new BadRequestException('No user found')
      }
    return profile;
  }
async updatePassword(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userService.findOne(id);
    if (!user) {
        throw new NotFoundException('User not found');
    }
    if (!updateUserDto.password) {
        throw new BadRequestException('Password is required');
    }
    const isSamePassword = await argon2.verify(user.password, updateUserDto.password);
    if (isSamePassword) {
        throw new BadRequestException('New password cannot be the same as the old password');
    }
    const newPassword = await argon2.hash(updateUserDto.password);
    await this.userService.update(id, {...UpdateUserDto,password: newPassword})
    const token= await this.generateToken(user._id,user.email,user.role)
    await this.updateRefreshToken(user._id,token.refreshToken)
    return {user , token}
}
//Vérifie qu’un utilisateur avec cet email existe déjà dans la base de données.
  async validateExistingUserByEmail(email: string) {
    const user = await this.userService.findbyEmail(email);
    return user; 
  }
  isVirtualEmail(email: string): boolean {
    return (
      email.endsWith('@smtp.dev') ||
      email.endsWith('@mail.tm') ||
      email.endsWith('@test.tn')
    );
  }
  
  async forgotPassword(email: string): Promise<{ message: string; status: number }> {
    const user = await this.userService.findbyEmail(email);
    if (!user) {
      throw new NotFoundException('Aucun utilisateur trouvé avec cet email');
    }

    const buffer = randomBytes(8);
    const plainPassword = buffer.toString('hex');
    const hashedPassword = await argon2.hash(plainPassword);
    await this.userService.update(user._id, { password: hashedPassword });

    // Configuration de Sendinblue
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = this.configService.get<string>('SENDINBLUE_API_KEY');

    const sendinblue = new SibApiV3Sdk.TransactionalEmailsApi();

    const emailParams: SibApiV3Sdk.SendSmtpEmail = {
      sender: { name: 'Gust-IT', email: 'noreply@votredomaine.com' },
      to: [{ email: user.email, name: user.fullName || 'Utilisateur' }],
      subject: 'Réinitialisation de votre mot de passe',
      htmlContent: `
        <p>Bonjour ${user.fullName || 'Utilisateur'},</p>
        <p>Votre mot de passe a été réinitialisé avec succès. Voici votre nouveau mot de passe temporaire :</p>
        <p><strong>${plainPassword}</strong></p>
        <p>Merci de le modifier depuis votre profil après connexion.</p>
      `,
    };

    try {
      await sendinblue.sendTransacEmail(emailParams);
      return {
        message: 'Mot de passe réinitialisé et envoyé par email.',
        status: 200,
      };
    } catch (err) {
      console.error('Erreur Sendinblue:', err);
      throw new BadRequestException('Échec de l’envoi du mot de passe par email');
    }
  }
  
}


    
    

  





  

