import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [MailService, JwtService, ConfigService],
  exports: [MailService],
})
export class MailModule {}
