import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { UpdateUserImageProfileDto } from 'src/auth/dto/update-user-image-profile-dto';
import { UsersEntity } from './entities/users.entity';

@Injectable()
export class UsersService {
  findOne: any;
  SendgridMesssageService: any;
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async findAll() {
    return await this.usersRepository.find({
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'ProfileImageUrl',
        'roles',
        'isEmailConfirmed',
      ],
    });
  }

  async findOneOrFail(options?: FindOneOptions<UsersEntity>) {
    try {
      return await this.usersRepository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  async store(data: CreateUserDto) {
    try {
      const user = this.usersRepository.create(data);

      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate email error
        throw new ConflictException(
          MessagesHelper.DUPLICATED_EMAIL_MESSAGE_ERROR,
        );
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async update(id: string, data: UpdateUserDto) {
    if (!data || !id) {
      throw new BadRequestException();
    }

    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { id },
      });
      this.usersRepository.merge(user, data);
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateImageProfile(id: string, data: UpdateUserImageProfileDto) {
    if (!data || !id) {
      throw new BadRequestException();
    }

    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { id },
      });
      this.usersRepository.merge(user, data);
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async destroy(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      await this.usersRepository.findOneOrFail({
        where: { id },
      });
      this.usersRepository.softDelete({ id });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async markEmailAsConfirmed(email: string) {
    return this.usersRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }

  async confirmEmail(email: string) {
    const user = await this.usersRepository.findOneOrFail({
      where: {
        email: email,
      },
    });
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.markEmailAsConfirmed(email);
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async resendConfirmationLink(userId: string) {
    const user = await this.findOneOrFail({
      where: { id: userId },
    });
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.mailService.sendVerificationLink(user.email);
  }

  async sendPasswordResetEmail(email: string) {
    try {
      // Procure o usuário pelo e-mail
      const user = await this.usersRepository.findOneOrFail({
        where: {
          email: email,
        },
      });

      // Gere um token de redefinição de senha e uma data de expiração
      const resetToken = this.jwtService.sign(
        {
          email: user.email,
        },
        {
          secret: this.configService.get('JWT_SECRET_KEY'),
          expiresIn: `${this.configService.get(
            'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
          )}s`,
        },
      );

      // Envie um e-mail com o link de redefinição de senha para o usuário
      await this.mailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      // Se o usuário não for encontrado, lança uma exceção de requisição inválida
      throw new BadRequestException(
        'Se o e-mail for encontrado enviaremos um link para redefinição de senha',
      );
    }
  }

  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string,
  ) {
    // Verifique se as senhas foram digitadas corretamente
    if (password !== confirmPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }

    // Verifique se o token é válido
    let email;
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });
      if (typeof payload === 'object' && 'email' in payload) {
        email = payload.email;
      } else {
        throw new BadRequestException('Token inválido');
      }
    } catch (error) {
      throw new BadRequestException('Token inválido');
    }

    // Encontre o usuário pelo email
    const user = await this.usersRepository.findOneOrFail({
      where: {
        email: email,
      },
    });

    // Atualize a senha do usuário
    user.password = hashSync(password, 10);
    await this.usersRepository.save(user);
  }
}
