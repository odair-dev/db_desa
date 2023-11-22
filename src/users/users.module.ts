import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersRepository } from './repositories/users.repository';
import { MailerModule } from '@nestjs-modules/mailer';
// import { TranscodeConsumer } from 'src/transcode.consumer';
// import { BullModule } from '@nestjs/bull';
// import { TRANSCODE_QUEUE } from 'src/constants';

@Module({
  imports: [
    // BullModule.forRoot({
    //   redis: {
    //     host: 'localhost',
    //     port: 6379,
    //   },
    // }),
    // BullModule.registerQueue({
    //   name: TRANSCODE_QUEUE,
    // }),
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
  providers: [UsersService, PrismaService, UsersRepository],
})
export class UsersModule {}
