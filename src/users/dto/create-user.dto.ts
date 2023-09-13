import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ROLES } from 'src/utils/constants';

export class CreateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(ROLES)
  @IsString()
  @IsNotEmpty()
  role: ROLES;

  @IsString()
  @IsNotEmpty()
  deviceToken: string;
}
