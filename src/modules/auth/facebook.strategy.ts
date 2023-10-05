import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor() {
        super({
            clientID: '833953628192114',
            clientSecret: '0b9af88a74f25f726385fffd5485c9c3',
            callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        const user = {
            facebookId: profile.id,
            fullName: profile.displayName,
            provider: profile.provider,
        }

        return done(null, user);
    }
}