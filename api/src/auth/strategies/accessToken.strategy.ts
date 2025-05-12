import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy,ExtractJwt } from 'passport-jwt';
type JwtPayload = {
    sub: string;
    email: string;
    role: string;


}
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
   constructor() {
     super({
       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
       secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET as string
   })
}

validate(payload: JwtPayload) {
  console.log('payload test')
   return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}