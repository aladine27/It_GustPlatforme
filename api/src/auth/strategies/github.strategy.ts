import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { AuthService } from '../auth.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy,'github'){
    constructor(
        private httpService: HttpService,

        private  authservice: AuthService,

    ){
        super({
            clientID:     process.env.GITHUB_CLIENTID!,
            clientSecret: process.env.GITHUB_CLIENTSECRET!,
            callbackURL:  process.env.GITHUB_CALLBACK_URL!,
            scope:['user:email'],
        });
    }
 async validate(accessToken: string, _refreshToken: string, profile: any) {
    let email = profile.emails?.[0]?.value;
    if (!email) {
      // on utilise HttpService pour appeler GitHub
      const response$ = this.httpService.get(
        'https://api.github.com/user/emails',
        { headers: { Authorization: `token ${accessToken}` } },
      );
      const resp = await firstValueFrom(response$);
      const primary = resp.data.find(
        (e: any) => e.primary && e.verified,
      );
      email = primary?.email;
    }
    if (!email) throw new UnauthorizedException('No email associated');
    const user = await this.authservice.validateExistingUserByEmail(email);
    if (!user) throw new UnauthorizedException('No account found');
    return user;
  }
    
    }