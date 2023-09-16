import { IsOptional, IsString, Validate } from 'class-validator';
import { IsDateValidConstraint } from 'src/common/validators';
// import { AddressDTO } from 'src/dto/address.dto';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsOptional()
  @Validate(IsDateValidConstraint, {
    message:
      'Invalid date format. Please provide a valid date in "yyyy-mm-dd" format.',
  })
  dob: string;
}
