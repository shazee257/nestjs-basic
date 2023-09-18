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
import { PaginationResult, QueryOption } from 'src/common/interfaces';
import { User } from 'src/schemas/user/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/search')
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req: Request, @Query() query: QueryOption): Promise<any> {
    // ): Promise<PaginationResult<User>> {
    const userId: string = req['user'].id;
    return this.usersService.findAll(query, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findOne(@Req() req: Request, @Query('userId') id: string): Promise<User> {
    const userId = id ? id : req['user'].id;
    return this.usersService.findOne(userId);
  }

  @Put('/update-profile')
  @UseGuards(AuthGuard('jwt'))
  update(@Req() req: Request, @Body() updateUserDto: UpdateUserDTO) {
    const userId = req['user'].id;
    console.log(userId);
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
