import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { UsersService } from 'src/users/users.service'; 
import {VerifyCallback} from "passport-google-oauth2";
import * as process from "process";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  
  constructor(
    private readonly usersService: UsersService,
     

  ) {
    super({
      clientID: process.env.GITHUB_CLIENTID,
      clientSecret: process.env.GITHUB_CLIENTSECRET ,
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: [ 'user:email' ],
    });
  }
async validate(accessToken: string, refreshToken: string, profile: any,done: VerifyCallback) {
 

  const response = await axios.get(`https://api.github.com/user/emails`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  });
   const emails = response.data;
  let email = "";
  const primaryEmails = emails.filter(email => email.primary === true);
  if (primaryEmails.length > 0) {
     email = primaryEmails[0].email;
  }

  const username = profile._json.login;

  const userInDB = await this.usersService.findbyEmail(email);

  if (userInDB) done(null,userInDB);

  const user = {
    provider: 'github',
    providerId: profile._json.id,
    email: email,
    fullName: username,
    image: profile._json.avatar_url,
  
  };

  done(null, user);
}

}