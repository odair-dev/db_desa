import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchedulesRepository } from './repositories/schedules.repository';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService, PrismaService, SchedulesRepository],
})
export class SchedulesModule {}
