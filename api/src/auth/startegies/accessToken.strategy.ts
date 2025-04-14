import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';

export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    validate(...args: any[]): unknown {
        throw new Error("Method not implemented.");
    }
}