import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersService } from 'src/users/users.service';
import { GoogleStrategy } from './google.strategy';
import { FacebookStrategy } from './facebook.strategy';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1y' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, GoogleStrategy, FacebookStrategy, UsersService],
  exports: [],
})
export class AuthModule { }
