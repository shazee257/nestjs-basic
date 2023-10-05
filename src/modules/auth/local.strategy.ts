import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';
import { throwError } from 'src/common/helpers';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(req: Request, email: string, password: string) {
    const { deviceToken } = req.body;
    if (!deviceToken) {
      throw new HttpException('deviceToken is required', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    try {
      const user = await this.usersService.login({
        email,
        password,
        deviceToken,
      });
      return user;
    } catch (error) {
      throwError(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
