import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  // RequestTimeoutException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { plainToInstance } from 'class-transformer';
import * as Mailgen from 'mailgen';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from '../dto/send-mail.dto';
import { randomUUID } from 'crypto';
import { InjectQueue } from '@nestjs/bull';
import { RESET_QUEUE } from 'src/constants';
import { Queue } from 'bull';

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'de Sá Incorporações',
    link: 'http://localhost:3001/',
  },
});

@Injectable()
export class UsersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    @InjectQueue(RESET_QUEUE) private readonly resetQueue: Queue,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingEmail = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingEmail) {
      console.log(existingEmail);
      throw new ConflictException('This email already exists');
    }
    const newUser = await this.prisma.user.create({
      data: createUserDto,
    });
    return plainToInstance(UserEntity, newUser);
  }

  async findAll(type: string): Promise<UserEntity[]> {
    const allUsers = await this.prisma.user.findMany();
    if (type == 'admin') {
      return plainToInstance(UserEntity, allUsers);
    } else {
      throw new UnauthorizedException('Only admin can perform this operation');
    }
  }

  async findAllActive(type: string): Promise<UserEntity[]> {
    const allUsers = await this.prisma.user.findMany({
      where: {
        active: true,
      },
    });
    if (type == 'admin') {
      return plainToInstance(UserEntity, allUsers);
    } else {
      throw new UnauthorizedException('Only admin can perform this operation');
    }
  }

  async findOne(
    id: string,
    token_id: string,
    type: string,
  ): Promise<UserEntity> {
    const uniqueUser = await this.prisma.user.findUnique({
      where: {
        id,
        active: true,
      },
    });
    if (!uniqueUser) {
      throw new NotFoundException('User not found');
    }
    if (id == token_id || type == 'admin') {
      return plainToInstance(UserEntity, uniqueUser);
    } else {
      throw new UnauthorizedException(
        'Only owner or admin can perform this operation',
      );
    }
  }

  async findByTokenReset(token_reset: string): Promise<UserEntity> {
    const uniqueUser = await this.prisma.user.findFirst({
      where: {
        reset: token_reset,
      },
    });
    if (!uniqueUser) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(UserEntity, uniqueUser);
  }

  async updateByTokenReset(
    token_reset: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const uniqueUser = await this.prisma.user.findFirst({
      where: {
        reset: token_reset,
      },
    });
    if (!uniqueUser) {
      throw new UnauthorizedException('unauthorized operation');
    }
    const user = await this.prisma.user.update({
      where: {
        id: uniqueUser.id,
      },
      data: {
        ...updateUserDto,
        reset: null,
      },
    });
    return plainToInstance(UserEntity, user);
  }

  async update(
    id: string,
    token_id: string,
    type: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const uniqueUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!uniqueUser) {
      throw new NotFoundException('User not found');
    }
    if (id == token_id || type == 'admin') {
      const user = this.prisma.user.update({
        where: {
          id,
        },
        data: updateUserDto,
      });
      return plainToInstance(UserEntity, user);
    } else {
      throw new UnauthorizedException(
        'Only owner or admin can perform this operation',
      );
    }
  }

  async remove(id: string, token_id: string, type: string) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        id,
        active: true,
      },
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    if (id == token_id || type == 'admin') {
      const user = this.prisma.user.update({
        where: {
          id,
        },
        data: { active: false },
      });
      return plainToInstance(UserEntity, user);
    } else {
      throw new UnauthorizedException(
        'Only owner or admin can perform this operation',
      );
    }
  }

  async sendMail({ to, subject, text }: SendEmailDto) {
    await this.mailerService
      .sendMail({
        to,
        subject,
        html: text,
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  resetPasswordTemplate(
    userEmail: string,
    userName: string,
    resetToken: string,
  ) {
    const email = {
      body: {
        greeting: 'Olá,',
        name: userName,
        signature: 'Atenciosamente',
        intro:
          'Você recebeu este e-mail porque foi recebida uma solicitação de redefinição de senha da sua conta.',
        action: {
          instructions: 'Clique no botão abaixo para redefinir sua senha:',
          button: {
            color: '#DC4D2F',
            text: 'Redefinir sua senha',
            link: `https://localhost:3001/user/reset/${resetToken}`,
          },
          outro:
            'Se você não solicitou uma redefinição de senha, nenhuma ação adicional será necessária de sua parte.',
        },
      },
    };

    const emailBody = mailGenerator.generate(email);

    const emailTemplate = {
      to: userEmail,
      subject: 'Redefinição de senha',
      text: emailBody,
    };

    return emailTemplate;
  }

  async resetPassword(email: string) {
    const uniqueUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!uniqueUser) {
      throw new NotFoundException('Account not found');
    } else {
      const resetToken = randomUUID();
      await this.prisma.user.update({
        where: {
          id: uniqueUser.id,
        },
        data: {
          reset: resetToken,
          active: true,
        },
      });

      await this.resetQueue.add({
        user: { ...uniqueUser, reset: resetToken },
        new: false,
        contact: false,
        reset: true,
      });

      return true;
    }
  }
}
