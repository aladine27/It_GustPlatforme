// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private defaultClient;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDINBLUE');
    this.defaultClient = SibApiV3Sdk.ApiClient.instance;
    this.defaultClient.authentications['api-key'].apiKey = apiKey;
  }

  async sendResetPasswordEmail(email: string, resetToken: string): Promise<void> {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`; // à adapter à ton front

    const emailContent = {
      sender: { name: 'GustPlatforme', email: 'noreply@gust.com' },
      to: [{ email }],
      subject: 'Réinitialisation de votre mot de passe',
      htmlContent: `<p>Bonjour,</p>
      <p>Voici le lien pour réinitialiser votre mot de passe :</p>
      <a href="${resetUrl}">${resetUrl}</a><br/><br/>
      <p>Ce lien est valable pendant 1 heure.</p>`,
    };

    await apiInstance.sendTransacEmail(emailContent);
  }
}
