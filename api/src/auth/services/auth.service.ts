import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import * as process from 'process';
import { HashService } from './hash.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async validateUser(fullName: string, pass: string): Promise<any> {
    const user = await this.usersService.findbyName(fullName);

    if (user && (await this.hashService.comparePassword(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, rememberMe = false) {
    const expiresIn = rememberMe ? '7d' : '1d';
    // On récupère l'identifiant via le champ _id en castant user en any.
    const userId = user.userId;
    // On utilise les autres attributs qui existent dans IUser.
    const { fullName, email, image, phone, Role, address } = user;

    return {
      access_token: this.jwtService.sign(
        { id: userId, fullName, email, image, phone, Role, address },
        { expiresIn },
      ),
    };
  }

  async signup(userDTO: CreateUserDto): Promise<any> {
    const existingUser = await this.usersService.findbyEmail(userDTO.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    userDTO.password = await this.hashService.hashPassword(userDTO.password);
    return await this.usersService.create(userDTO);
  }

  async forgetPassword(email: string): Promise<void> {
    const user = await this.usersService.findbyEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = uuidv4();
    // Cast de user pour accéder à _id
    const userId = (user as any)._id;
    await this.usersService.storePwdToken(resetToken, userId);
    const resetPasswordLink = `http://localhost:5173/forget-password?token=${resetToken}`;

    const sendinblue = new SibApiV3Sdk.TransactionalEmailsApi();
    const apiKey = process.env.SENDINBLUE;
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    defaultClient.authentications['api-key'].apiKey = apiKey;

    const emailParams = {
      sender: { name: 'TektAi', email: 'alaedineibrahim@gmail.com' },
      to: [{ email }],
      subject: 'Reset Your Password',
      htmlContent: `
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            .logo { margin-bottom: 20px; }
            h1 { font-size: 24px; color: #333; margin-bottom: 10px; }
            p { font-size: 16px; color: #666; line-height: 1.6; margin-bottom: 20px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #0091ff; color: #fff; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src="./image.png" alt="Logo">
            </div>
            <h1>Reset Your Password</h1>
            <p>Please click the button below to reset your password.</p>
            <a href="${resetPasswordLink}" class="button">Reset Password</a>
          </div>
        </body>
      </html>
      `,
    };

    try {
      await sendinblue.sendTransacEmail(emailParams);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new NotFoundException('Invalid or expired token');
    }
    const hashedPassword = await this.hashService.hashPassword(newPassword);
    const userId = (user as any)._id;
    await this.usersService.updatePassword(userId, hashedPassword);
    await this.usersService.clearResetToken(userId);
  }

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const user = await this.usersService.findbyEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isPasswordCorrect = await this.hashService.comparePassword(
        currentPassword,
        user.password,
      );
      if (!isPasswordCorrect) {
        throw new ConflictException('Current password is incorrect');
      }
      const hashedNewPassword = await this.hashService.hashPassword(newPassword);
      const userId = (user as any)._id;
      await this.usersService.updatePassword(userId, hashedNewPassword);
    } catch (error) {
      this.logger.error('Error changing password:', error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      } else if (error instanceof ConflictException) {
        throw new ConflictException('Current password is incorrect');
      } else {
        throw new InternalServerErrorException('Failed to change password');
      }
    }
  }
}
