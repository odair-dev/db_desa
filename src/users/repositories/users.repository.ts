import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { plainToInstance } from 'class-transformer';
import * as Mailgen from 'mailgen';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from '../dto/send-mail.dto';

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

  receiptScheduleTemplate(userEmail: string, userName: string, text: string) {
    const email = {
      body: {
        greeting: 'Olá',
        name: userName,
        intro: `Seu agendamento foi realizado com sucesso para ${text}.`,
        outro: 'DeSá Incorporações. Projetando sonhos, construindo o futuro.',
        signature: 'Atenciosamente',
      },
    };

    const emailBody = mailGenerator.generate(email);

    const emailTemplate = {
      to: userEmail,
      subject: 'Agendamento de visita',
      text: emailBody,
    };

    return emailTemplate;
  }

  receiptNewScheduleTemplate(
    userEmail: string,
    userName: string,
    text: string,
  ) {
    const email = {
      body: {
        greeting: userName,
        intro: `Um novo agendamento foi realizado para ${text}.`,
        signature: 'Atenciosamente',
      },
    };

    const emailBody = mailGenerator.generate(email);

    const emailTemplate = {
      to: userEmail,
      subject: 'Agendamento de visita',
      text: emailBody,
    };

    return emailTemplate;
  }

  receiptScheduleRemoveTemplate(
    userEmail: string,
    userName: string,
    text: string,
  ) {
    const email = {
      body: {
        greeting: userName,
        intro: `Cancelou a visita ${text}.`,
        signature: 'Atenciosamente',
      },
    };

    const emailBody = mailGenerator.generate(email);

    const emailTemplate = {
      to: userEmail,
      subject: 'Cancelamento de visita',
      text: emailBody,
    };

    return emailTemplate;
  }

  contactEmailTemplate(userEmail: string, userName: string, text: string) {
    const email = {
      body: {
        greeting: userName,
        intro: text,
        signature: userEmail,
      },
    };

    const emailBody = mailGenerator.generate(email);

    const emailTemplate = {
      to: 'odairodriguez@yahoo.com.br',
      subject: 'Contato via site',
      text: emailBody,
    };

    return emailTemplate;
  }
}
