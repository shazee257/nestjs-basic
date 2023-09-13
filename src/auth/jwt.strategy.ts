import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/schemas/user/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('accessToken'),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  async validate(payload: User): Promise<User> {
    return payload;
  }
}
