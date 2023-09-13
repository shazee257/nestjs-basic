import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_MODEL, UserDocument } from 'src/schemas/user/user.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { comparePassword, hashPassword } from 'src/utils';
import { loginDTO } from 'src/auth/dto/login.dto';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDTO) {
    // find if user exists
    const userExists = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (userExists) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: ['User already exists'],
          error: 'User already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // hash password
    createUserDto.password = hashPassword(createUserDto.password);

    return this.userModel.create(createUserDto);
  }

  async findAll(req: Request) {
    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 10;

    return this.userModel.find();
  }

  async findOne(id) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDTO) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async remove(id) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      _id: id,
    };
  }

  async login(loginDto: loginDTO) {
    try {
      const user = await this.userModel.findOne(
        { email: loginDto.email },
        '+password',
      );
      if (!user) throw new NotFoundException();

      const passwordMatch = comparePassword(loginDto.password, user.password);
      if (!passwordMatch)
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Password is incorrect',
        });

      const updatedUser = await this.userModel.findOneAndUpdate(
        { email: loginDto.email },
        { deviceToken: loginDto.deviceToken },
        { new: true },
      );
      return updatedUser;
    } catch (error) {
      console.error('Error updating deviceToken:', error);
      throw new InternalServerErrorException();
    }
  }
}
