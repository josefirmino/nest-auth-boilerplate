import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as sendgridMail from '@sendgrid/mail';
import { MailInput } from './mail.input';

@Injectable()
export class MailService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    sendgridMail.setApiKey(configService.get('SENDGRID_API_KEY'));
  }

  async sendMail(input: MailInput) {
    await sendgridMail.send({
      from: this.configService.get('SENDGRID_FROM'),
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
  }

  async sendVerificationLink(email: string) {
    // Sengrid send e-mail user register
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;

    const html = `Welcome to the application. To confirm the email address, click here: ${url}`;
    await this.sendMail({
      html,
      to: email,
      subject: 'Please confirm your e-mail',
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    // Build the password reset link
    const url = `${this.configService.get(
      'EMAIL_FORGOT_PASSWORD_URL',
    )}?token=${resetToken}`;

    const html = `To reset your password, follow this link: ${url}`;
    // Send the password reset email
    await this.sendMail({
      html,
      to: email,
      subject: 'Password reset',
    });
  }
}
