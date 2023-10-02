import {
  BadRequestException,
  Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Put, Query, Req, Res, UnprocessableEntityException, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { PaginationResult, QueryOption } from 'src/common/interfaces';
import { User } from 'src/schemas/user/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { filterImage, generateFilename, generateResponse, throwError } from 'src/common/helpers';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('/search')
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @GetCurrentUserId() userId: string,
    @Res() res: Response,
    @Query('page', new ParseIntPipe()) page: number = 1,
    @Query('limit', new ParseIntPipe()) limit: number = 10,
    @Query('search') keyword: string = '') {
    const options: QueryOption = { page, limit, keyword, userId };

    try {
      const users = await this.usersService.findAll(options);
      generateResponse(users, 'Fetched profile successfully', res);
    } catch (error) {
      throwError(error);
    }

  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Res() res: Response, @GetCurrentUserId() userId: string) {
    const user = await this.usersService.findOne(userId);
    generateResponse(user, 'Fetched profile successfully', res);


  }

  @Put('/update-profile')
  @UseGuards(AuthGuard('jwt'))
  update(@GetCurrentUserId() userId: string, @Body() updateUserDto: UpdateUserDTO) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete('/remove-account')
  @UseGuards(AuthGuard('jwt'))
  remove(@GetCurrentUserId() userId: string) {
    return this.usersService.remove(userId);
  }

  @Put('/upload-image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/users/',
        filename: generateFilename,
      }),
      fileFilter: filterImage,
    }),
  )
  uploadImage(@GetCurrentUserId() userId: string, @Req() req: Request, @UploadedFile() file) {
    console.log('req.fileValidationError >>>>>>>>>>>>>> ', req['fileValidationError']);

    // error handling
    if (req['fileValidationError']) {
      throw new HttpException(
        req['fileValidationError'],
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.usersService.uploadImage(userId, file.filename);
  }
}
