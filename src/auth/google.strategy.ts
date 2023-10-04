import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: '618367925890-pcuuin4lqigb15nsmflv8ggdihvo8fri.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/api/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { id, name, emails, photos } = profile;
        const user = {
            googleId: id,
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            image: photos[0].value,
            accessToken
        };

        return done(null, user);
    }
}