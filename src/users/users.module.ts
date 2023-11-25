import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersRepository } from './repositories/users.repository';
import { MailerModule } from '@nestjs-modules/mailer';
import { RESET_QUEUE } from 'src/constants';
import { BullModule } from '@nestjs/bull';
import { ResetConsumer } from 'src/reset.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: RESET_QUEUE,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        defaults: {
          from: 'agendamento.desa@gmail.com',
        },
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UsersRepository, ResetConsumer],
})
export class UsersModule {}
