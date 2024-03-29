import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchedulesRepository } from './repositories/schedules.repository';
import { TranscodeConsumer } from 'src/transcode.consumer';
import { BullModule } from '@nestjs/bull';
import { TRANSCODE_QUEUE } from 'src/constants';
// import { UsersService } from 'src/users/users.service';
// import { UsersRepository } from 'src/users/repositories/users.repository';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: TRANSCODE_QUEUE,
    }),
  ],
  controllers: [SchedulesController],
  providers: [
    SchedulesService,
    PrismaService,
    SchedulesRepository,
    TranscodeConsumer,
    // UsersService,
    // UsersRepository,
  ],
  // exports: [BullModule],
})
export class SchedulesModule {}
