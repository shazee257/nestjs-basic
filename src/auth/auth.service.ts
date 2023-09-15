import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/user/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: User): string {
    return this.jwtService.sign({
      id: payload['_id'],
      email: payload.email,
      role: payload.role,
    });
  }
}
