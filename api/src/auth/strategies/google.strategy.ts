import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      console.log('Full Google profile:', profile);
  
      const email = profile?.emails?.[0]?.value;
      if (!email) {
        return done(new UnauthorizedException('No email associated'), null);
      }
  
      const user = await this.authService.validateExistingUserByEmail(email);
      if (!user) {
        return done(new NotFoundException('No account found'), null);
      }
  
      return done(null, user);
    } catch (err) {
      console.error('Error in GoogleStrategy.validate:', err);
      return done(err, null);
    }
  }
}