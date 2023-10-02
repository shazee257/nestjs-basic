import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserWithAccessToken } from 'src/common/interfaces';
import { User } from 'src/schemas/user/user.schema';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register.dto';
import { GetCurrentUser } from 'src/common/decorators/indext';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @HttpCode(200)
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@GetCurrentUser() user: User)
    : UserWithAccessToken {
    const accessToken = this.authService.generateToken(user);

    return { user, accessToken };
  }

  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDTO): Promise<UserWithAccessToken> {
    const user: User = await this.usersService.create(registerUserDto);
    const accessToken = this.authService.generateToken(user);

    return {
      user,
      accessToken,
    };
  }
}
