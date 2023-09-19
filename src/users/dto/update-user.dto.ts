import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Validate
} from 'class-validator';
import { IsDateValidConstraint } from 'src/common/validators';
// import { AddressDTO } from 'src/dto/address.dto';

export class UpdateUserDTO {
  @IsString({ message: 'First name is not valid.' })
  @Matches(/^[a-zA-Z]+[0-9]*$/, { message: 'First name is not valid.' })
  @Length(3, 30, { message: 'First name must be between 3 and 30 characters long.' })
  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @IsString({ message: 'Last name is not valid.' })
  @Matches(/^[a-zA-Z]+[0-9]*$/, { message: 'Last name is not valid.' })
  @Length(3, 30, { message: 'Last name must be between 3 and 30 characters long.' })
  @IsNotEmpty({ message: 'Last name is required.' })
  lastName: string;

  @IsString({ message: 'dob is not valid.' })
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, { message: 'dob is not valid.' })
  @IsNotEmpty({ message: 'dob is required.' })
  @Validate(IsDateValidConstraint, { message: 'Invalid date format. Please provide a valid date in "yyyy-mm-dd" format.' })
  dob: string;
}
