import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GetCurrentUser } from 'src/common/decorators';
import { generateResponse } from 'src/common/helpers';
import { User } from 'src/schemas/user/user.schema';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Res() res: Response, @GetCurrentUser() user: User) {
    const accessToken = this.authService.generateToken(user);
    generateResponse({ user, accessToken }, 'Logged in successfully', res);
  }

  @Post('/register')
  async register(@Res() res: Response, @Body() registerUserDto: RegisterUserDTO) {
    const user: User = await this.usersService.create(registerUserDto);
    const accessToken = this.authService.generateToken(user);
    generateResponse({ user, accessToken }, 'Registered successfully', res);
  }
}
