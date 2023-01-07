import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ConfirmPassword } from 'src/auth/decorators/cofirmpassword.decorator';
import { MessagesHelper } from '../../../helpers/messages.helper';
import { RegExHelper } from '../../../helpers/regex.helper';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4, {
    message: MessagesHelper.USER_FISTNAME_MIN_CARACTERES_MESSAGE_ERROR,
  })
  @MaxLength(20)
  firstName: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(8)
  @MaxLength(30)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(RegExHelper.password, { message: MessagesHelper.PASSWORD_VALID })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(RegExHelper.password, { message: MessagesHelper.PASSWORD_VALID })
  @ConfirmPassword('password', {
    message: MessagesHelper.PASSWORD_CONFIRMATION_MESSAGE_ERROR,
  })
  confirmPassword: string;
}
