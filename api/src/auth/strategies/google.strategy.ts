import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
   _accessToken: string,
   _refreshToken: string,
   profile:any,
   done:VerifyCallback,

  ):Promise<any> {
   const email = profile.emails?.[0]?.value;
   if (!email){
    throw new UnauthorizedException('No email associated');
   }
   const user =await this.authService.validateExistingUserByEmail(email);
   if (!user){
    throw new NotFoundException('No account found');
   }
   return  done(null,user);
   }
  }
