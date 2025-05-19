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
        //test existantce user
        const user = await this.userService.findbyEmail(CreateLoginDto.email)
        if (!user){
            throw new BadRequestException("user not exist")

        }
        //test Password
        const passwordMatches= await argon2.verify(user.password,CreateLoginDto.password)
        console.log(passwordMatches)
        if (!passwordMatches){
            throw new BadRequestException("password incorrect")
        }
        //generate Token
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
    return user; // ou null si pas trouvé
  }
  async forgotPassword(email: string): Promise<{ message: string; status: number }> {
    // Vérifier que l’utilisateur existe
    const user = await this.userService.findbyEmail(email);
    if (!user) {
      console.log('[Service] No user found for email:', email);
      throw new NotFoundException('Aucun utilisateur trouvé avec cet email');
    }
    // Générer un mot de passe aléatoire en clair
    const buffer = randomBytes(16);
    const plainPassword = buffer.toString('hex');
    // Hacher le mot de passe
    const hashedPassword = await argon2.hash(plainPassword);
    

    // 4) Mettre à jour le mot de passe en base
    await this.userService.update(user._id, { password: hashedPassword });
    console.log('[Service] Password updated in database');

    // 5) Configurer le client SendinBlue
    console.log('[Service] Configuring SendinBlue client');
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKeyAuth = defaultClient.authentications['api-key'];
     
    const sendinblue = new SibApiV3Sdk.TransactionalEmailsApi();

    // Préparer le contenu de l’e‑mail
    const emailParams: SibApiV3Sdk.SendSmtpEmail = {
      sender: { name: 'Votre Société', email: 'noreply@votredomaine.com' },
      to: [{ email: user.email, name: user.fullName }],
      subject: 'Votre nouveau mot de passe',
      htmlContent: `
        <p>Bonjour ${user.fullName},</p>
        <p>Votre mot de passe a été réinitialisé. Le voici :</p>
        <pre><strong>${plainPassword}</strong></pre>
        <p>Vous pourrez le modifier ensuite dans votre profil.</p>
      `,
    };

    //  Envoyer l’e‑mail
    try {
      console.log('[Service] Sending email via SendinBlue to:', user.email);
      await sendinblue.sendTransacEmail(emailParams);
      console.log('[Service] Email sent successfully');
    } catch (error) {
      console.error('[Service] Error sending email:', error);
      throw error;
    }
    //  Retourner la confirmation
    return {
      message: 'Un email a été envoyé avec votre nouveau mot de passe.',
      status: 200,
    };
  }
}


    
    

  





  

