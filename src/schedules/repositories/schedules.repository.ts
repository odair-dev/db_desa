import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { ScheduleEntity } from '../entities/schedule.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SchedulesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    token_id: string,
    property_id: string,
    createScheduleDto: CreateScheduleDto,
  ): Promise<ScheduleEntity> {
    const newSchedule = {
      ...createScheduleDto,
      user_id: token_id,
      property_id: property_id,
    };
    const foundProperty = await this.prisma.property.findUnique({
      where: {
        id: property_id,
      },
    });
    if (foundProperty) {
      const conflict_property = await this.prisma.schedule.findFirst({
        where: {
          date: newSchedule.date,
          hour: newSchedule.hour,
          property_id: newSchedule.property_id,
        },
      });
      const conflict_user = await this.prisma.schedule.findFirst({
        where: {
          date: newSchedule.date,
          hour: newSchedule.hour,
          user_id: newSchedule.user_id,
        },
      });
      if (conflict_property || conflict_user) {
        throw new ConflictException(
          'The user or property already has an appointment for this day and time.',
        );
      } else {
        const newRegisterSchedule = await this.prisma.schedule.create({
          data: newSchedule,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                type: true,
                active: true,
              },
            },
            property: {
              include: {
                address: {
                  select: {
                    street: true,
                    number: true,
                    district: true,
                    city: true,
                  },
                },
              },
            },
          },
        });
        return plainToInstance(ScheduleEntity, newRegisterSchedule);
      }
    } else {
      throw new NotFoundException('Property not found');
    }
  }

  async findAll(user_id: string, type: string) {
    if (type == 'admin') {
      return this.prisma.schedule.findMany();
    } else {
      return this.prisma.schedule.findMany({
        where: {
          user_id,
        },
      });
    }
  }

  async findFreeSchedule(hour: string, date: Date) {
    const findSchedule = await this.prisma.schedule.findFirst({
      where: {
        hour,
        date,
      },
    });
    if (findSchedule) {
      return { free_time_schedule: false };
    } else {
      return { free_time_schedule: true };
    }
  }

  async findOne(
    id: string,
    user_id: string,
    type: string,
  ): Promise<ScheduleEntity> {
    const foundSchedule = await this.prisma.schedule.findUnique({
      where: {
        id,
      },
    });
    if (foundSchedule) {
      if (type == 'admin' || foundSchedule.user_id == user_id) {
        return foundSchedule;
      } else {
        throw new UnauthorizedException(
          'Only the owner or admin can perform this operation',
        );
      }
    } else {
      throw new NotFoundException('Schedule not found');
    }
  }

  async update(
    id: string,
    user_id: string,
    type: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<ScheduleEntity> {
    const foundSchedule = await this.prisma.schedule.findUnique({
      where: {
        id,
      },
    });
    if (foundSchedule) {
      if (type == 'admin' || foundSchedule.user_id == user_id) {
        return this.prisma.schedule.update({
          where: {
            id,
          },
          data: updateScheduleDto,
        });
      } else {
        throw new UnauthorizedException(
          'Only the owner or admin can perform this operation',
        );
      }
    } else {
      throw new NotFoundException('Schedule not found');
    }
  }

  async remove(id: string, user_id: string, type: string): Promise<void> {
    const foundSchedule = await this.prisma.schedule.findUnique({
      where: {
        id,
      },
    });
    if (foundSchedule) {
      if (type == 'admin' || foundSchedule.user_id == user_id) {
        await this.prisma.schedule.delete({
          where: {
            id,
          },
        });
      } else {
        throw new UnauthorizedException(
          'Only the owner or admin can perform this operation',
        );
      }
    } else {
      throw new NotFoundException('Schedule not found');
    }
  }
}
