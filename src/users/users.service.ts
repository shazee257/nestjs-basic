import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { loginDTO } from 'src/auth/dto/login.dto';
import { USER_MODEL, User, UserDocument } from 'src/schemas/user/user.schema';
import {
  comparePassword,
  getAggregatedPaginatedResult,
  hashPassword,
} from 'src/common/helpers';
import { UpdateUserDTO } from './dto/update-user.dto';
import { RegisterUserDTO } from 'src/auth/dto/register.dto';
import { fetchAllUsers } from './query/user.query';
import { PaginationResult, QueryOption } from 'src/common/interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(USER_MODEL)
    private readonly userModel: Model<UserDocument>,
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

  async findAll(query: QueryOption, userId: string) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const keyword = query.search || '';

    const { result, pagination }: PaginationResult<User> =
      await getAggregatedPaginatedResult({
        model: this.userModel,
        query: fetchAllUsers(userId, keyword),
        page,
        limit,
      });

    return { result, pagination };
  }

  async findOne(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDTO) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserDto,
      { new: true },
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

  async uploadImage(userId: string, fileName: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { image: `users/${fileName}` },
      { new: true },
    );
  }
}
