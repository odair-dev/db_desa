import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchedulesRepository } from './repositories/schedules.repository';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/repositories/users.repository';

@Module({
  controllers: [SchedulesController],
  providers: [
    SchedulesService,
    PrismaService,
    SchedulesRepository,
    UsersService,
    UsersRepository,
  ],
})
export class SchedulesModule {}
