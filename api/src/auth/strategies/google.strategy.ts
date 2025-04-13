import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import * as process from 'process';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(GoogleStrategy.name);
  constructor(
    private usersService: UsersService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENTID!,       // Assurez-vous que la variable est définie dans votre .env
      clientSecret: process.env.GOOGLE_CLIENTSECRET!, // Assurez-vous que la variable est définie dans votre .env
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // Pour les tests, si certains champs ne sont pas définis dans le profile,
    // vous pouvez leur fournir des valeurs par défaut.
    const email = profile.email || 'test@gmail.com';
    const id = profile.id || 'default-id';
    const displayName = profile.displayName || 'Test User';
    const photos = profile.photos && profile.photos.length > 0 
      ? profile.photos 
      : [{ value: 'http://placehold.it/100x100' }];

    // Rechercher l'utilisateur dans la base de données via son email
    const userInDB = await this.usersService.findbyEmail(email);
    if (userInDB) {
      return done(null, userInDB);
    }

    // Créer un nouvel utilisateur avec les informations récupérées
    const user = {
      provider: 'google',
      providerId: id,
      email: email,
      name: displayName,
      picture: photos[0].value,
      didNotFinishSignup: true,
    };

    done(null, user);
  }
}
