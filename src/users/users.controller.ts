import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { PaginationResult, QueryOption } from 'src/common/interfaces';
import { User } from 'src/schemas/user/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { filterImage, generateFilename } from 'src/common/helpers';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('/search')
  @UseGuards(AuthGuard('jwt'))
  findAll(
    @Req() req: Request,
    @Query('page', new ParseIntPipe()) page: number = 1,
    @Query('limit', new ParseIntPipe()) limit: number = 10,
    @Query('search') keyword: string = '',
  ): Promise<PaginationResult<User>> {
    const userId: string = req['user'].id;
    const options: QueryOption = { page, limit, keyword, userId };
    return this.usersService.findAll(options);
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
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
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
  uploadImage(@Req() req, @UploadedFile() file) {
    console.log('file >>>>>>>>>>>>>> ', req.fileValidationError);

    // error handling
    if (req.fileValidationError) {
      throw new HttpException(
        req.fileValidationError,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.usersService.uploadImage(req.user.id, file.filename);
  }
}
