import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { PassportModule } from '@nestjs/passport';
import { GithubStrategy } from './strategies/github.strategy';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports:[UsersModule,
    HttpModule,
    PassportModule.register({session:false}),
    JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService,AccessTokenStrategy,GithubStrategy],
})
export class AuthModule {}
