import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_MODEL, UserDocument } from 'src/schemas/user/user.schema';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDTO) {
    try {
      return await this.userModel.create(createUserDto);
    } catch (error) {
      console.log(error);
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.errors);
      }

      throw new ServiceUnavailableException();
    }
  }

  async findAll() {
    return await this.userModel.find();
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
}
