import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { loginDTO } from 'src/auth/dto/login.dto';
import { USER_MODEL, UserDocument } from 'src/schemas/user/user.schema';
import { comparePassword, hashPassword } from 'src/utils';
import { UpdateUserDTO } from './dto/update-user.dto';
import { RegisterUserDTO } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(registerUserDto: RegisterUserDTO) {
    const userExists = await this.userModel.findOne({
      email: registerUserDto.email,
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
    registerUserDto.password = hashPassword(registerUserDto.password);

    const user = await this.userModel.create(registerUserDto);
    return user;
  }

  async findAll(query) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    return this.userModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
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
    const user = await this.userModel.findOne(
      { email: loginDto.email },
      '+password',
    );
    if (!user) throw new NotFoundException('User not found');

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
  }
}
