import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

import { ConfigService } from '@nestjs/config';
import { configureAwsSdk } from 'src/AWS/aws-sdk.config';

import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import { ConfirmEmailDto } from 'src/mail/dto/confirmEmail.dto';
import { ForgotPasswordDto } from './dto/forgot-password-user.dto';
import { ResetPassowrdUserDto } from './dto/reset-password-user.dto';
import { UsersService } from 'src/app/users/users.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    configureAwsSdk(configService);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any) {
    return await this.authService.login(req.user);
  }

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.usersService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.usersService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @UseGuards(AuthGuard('jwt'))
  async resendConfirmationLink(@Req() request: any) {
    await this.usersService.resendConfirmationLink(request.user.id);
  }

  @Post('forgot-password')
  async sendPasswordResetEmail(@Body() email: ForgotPasswordDto) {
    return this.usersService.sendPasswordResetEmail(email.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPassowrdUserDto) {
    const { token, password, confirmPassword } = body;
    return this.usersService.resetPassword(token, password, confirmPassword);
  }

  @Post('upload-image-profile')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard('jwt'))
  async uploadProfileImage(@Req() request: any, @UploadedFile() image) {
    // Gere um nome de arquivo único para a imagem
    const fileName = `${new Date().getTime()}-${image.originalname}`;

    // Crie um objeto do S3
    const s3 = new AWS.S3();

    // Faça o upload da imagem para o S3
    const response = await s3
      .upload({
        Bucket: 'techands-agrocana-intranet',
        Key: fileName,
        Body: image.buffer,
        ContentType: image.mimetype,
        ACL: 'public-read',
      })
      .promise();

    // Salve a URL da imagem no banco de dados
    const ProfileImageUrl = response.Location;
    await this.usersService.updateImageProfile(request.user.id, {
      ProfileImageUrl,
    });

    return ProfileImageUrl;
  }
}
