import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) { }

  generateToken(user: User): string {
    return this.jwtService.sign({
      id: user['id'],
      email: user?.email,
      role: user.role,
      provider: user.provider
    });
  }
}
