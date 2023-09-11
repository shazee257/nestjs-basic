import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressDTO } from 'src/dto/address.dto';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString({ each: true })
  @IsOptional()
  social: string[];

  @Type(() => AddressDTO)
  @ValidateNested()
  @IsOptional()
  address: AddressDTO;
}
