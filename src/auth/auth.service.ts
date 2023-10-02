import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/user/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) { }

  generateToken(user: User, userId: string): string {
    return this.jwtService.sign({
      id: userId,
      email: user.email,
      role: user.role,
    });
  }
}
