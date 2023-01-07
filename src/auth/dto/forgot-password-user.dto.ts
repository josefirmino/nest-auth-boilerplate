import { IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(8)
  @MaxLength(30)
  email: string;
}
