import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { User } from 'src/schemas/user/user.schema';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register.dto';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @HttpCode(200)
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@GetCurrentUserId() userId: string, @GetCurrentUser() user: User)
    : { user: User; accessToken: string } {
    const accessToken = this.authService.generateToken(user, userId);

    return { user, accessToken };
  }

  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDTO): Promise<{
    user: User;
    accessToken: string;
  }> {
    const user: User = await this.usersService.create(registerUserDto);
    const accessToken = this.authService.generateToken(user, user['_id']);

    return {
      user,
      accessToken,
    };
  }
}
