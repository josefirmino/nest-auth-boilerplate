import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { RegExHelper } from 'src/helpers/regex.helper';
import { ConfirmPassword } from '../decorators/cofirmpassword.decorator';
export class ResetPassowrdUserDto {
  @IsString()
  @IsNotEmpty()
  token: string;

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
