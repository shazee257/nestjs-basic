import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GetCurrentUser } from 'src/common/decorators';
import { generateResponse } from 'src/common/helpers';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { User } from '../schemas/user.schema';

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

  @Get('/google')
  // @UseGuards(AuthGuard('facebook'))
  @UseGuards(AuthGuard('google'))
  googleLogin(@Req() req) { }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Res() res: Response, @GetCurrentUser() user: User) {
    if (!user) {
      generateResponse(null, 'Google user not found', res);
    }

    const userObj: User = await this.usersService.googleLogin(user);
    userObj['id'] = userObj['_id'];

    const accessToken = this.authService.generateToken(userObj);
    generateResponse({ user: userObj, accessToken }, 'Logged in successfully', res);
    return {
      user: userObj,
      accessToken
    }
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin(@Req() req) { }

  @Get('/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Res() res: Response, @GetCurrentUser() user: any) {
    if (!user) {
      generateResponse(null, 'Facebook user not found', res);
    }

    const userObj: User = await this.usersService.facebookLogin(user);
    userObj['id'] = userObj['_id'];

    const accessToken = this.authService.generateToken(userObj);
    generateResponse({ user: userObj, accessToken }, 'Logged in successfully', res);
    return {
      user: userObj,
      accessToken
    }
  }
}
