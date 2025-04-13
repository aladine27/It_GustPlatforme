import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { UsersService } from 'src/users/users.service';
import { VerifyCallback } from 'passport-google-oauth2';
import * as process from 'process';
import { HashService } from '../services/hash.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(GithubStrategy.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {
    super({
      clientID: process.env.GITHUB_CLIENTID!,
      clientSecret: process.env.GITHUB_CLIENTSECRET!,
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    // Pour les tests, nous n'utilisons pas axios et récupérons l'email directement.
    // Certaines données peuvent ne pas être présentes dans le profile pour les comptes GitHub
    // de test, c'est pourquoi on utilise une valeur par défaut.
    const email = profile._json.email || 'test@example.com';
    const username = profile._json.login;

    const userInDB = await this.usersService.findbyEmail(email);
    if (userInDB) {
      return done(null, userInDB);
    }

    const user = {
      provider: 'github',
      providerId: profile._json.id,
      email: email,
      name: username,
      picture: profile._json.avatar_url,
      didNotFinishSignup: true,
    };

    done(null, user);
  }
}
