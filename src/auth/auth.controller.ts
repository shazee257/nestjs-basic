import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from 'src/schemas/user/user.schema';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(200)
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req: Request): { user: User; accessToken: string } {
    const token = this.authService.generateToken(req['user']);

    return {
      user: req['user'],
      accessToken: token,
    };
  }

  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDTO): Promise<{
    user: User;
    accessToken: string;
  }> {
    const user: any = await this.usersService.create(registerUserDto);
    const accessToken = this.authService.generateToken(user);

    return {
      user,
      accessToken,
    };
  }
}
