import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { QueryOption } from 'src/interfaces/queryOption.interface';
import { User } from 'src/schemas/user/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/search')
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req: Request, @Query() query: QueryOption): Promise<any> {
    const userId: string = req['user'].id;
    console.log(userId);
    return this.usersService.findAll(query, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findOne(@Req() req: Request, @Query('userId') id: string): Promise<User> {
    const userId = id ? id : req['user'].id;
    return this.usersService.findOne(userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
