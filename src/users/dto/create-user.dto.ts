import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { AddressDTO } from 'src/dto/address.dto';
import { ACCOUNT_TYPE } from 'src/utils/constants';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(ACCOUNT_TYPE)
  @IsNotEmpty()
  accountType: ACCOUNT_TYPE;

  @IsString({ each: true })
  @IsOptional()
  social: string[];

  @Type(() => AddressDTO)
  @ValidateNested()
  @IsNotEmpty()
  address: AddressDTO;

  @IsOptional()
  metadata: Record<string, any>;
}
