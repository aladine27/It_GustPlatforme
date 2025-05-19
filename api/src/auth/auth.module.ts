// src/auth/auth.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule }      from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule }     from '@nestjs/axios';
import { APP_GUARD }      from '@nestjs/core';

import { AuthService }         from './auth.service';
import { AuthController }      from './auth.controller';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { GithubStrategy }      from './strategies/github.strategy';
import { GoogleStrategy }      from './strategies/google.strategy';
import { UsersModule }         from 'src/users/users.module';

import { AccessTokenGuard }    from 'src/guards/accessToken.guard';
import { RolesGuard }          from 'src/guards/roles.guard';
import { MailModule } from 'src/mail/mail.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    UsersModule,  // pour injecter UsersService dans AuthService
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports:    [ConfigModule],
      inject:     [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:      config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_ACCESS_TOKEN_EXPIRATION') || '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    GithubStrategy,
    GoogleStrategy,
    MailModule,

  
    AccessTokenGuard,
    RolesGuard,

  
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [
    AuthService,
    PassportModule,
    JwtModule,
    // Pas besoin d’exporter les guards ici
  ],
})
export class AuthModule {}
