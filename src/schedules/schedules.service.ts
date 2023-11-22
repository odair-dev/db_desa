import { Injectable } from '@nestjs/common';
import { ContactEmailDto, CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SchedulesRepository } from './repositories/schedules.repository';

@Injectable()
export class SchedulesService {
  constructor(private readonly repository: SchedulesRepository) {}

  create(
    token_id: string,
    property_id: string,
    createScheduleDto: CreateScheduleDto,
  ) {
    return this.repository.create(token_id, property_id, createScheduleDto);
  }

  findAll(user_id: string, type: string) {
    return this.repository.findAll(user_id, type);
  }

  findOne(id: string, user_id: string, type: string) {
    return this.repository.findOne(id, user_id, type);
  }

  findFreeSchedule(schedules: string, date: Date) {
    return this.repository.findFreeSchedule(schedules, date);
  }

  update(
    id: string,
    user_id: string,
    type: string,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.repository.update(id, user_id, type, updateScheduleDto);
  }

  remove(id: string, user_id: string, type: string) {
    return this.repository.remove(id, user_id, type);
  }

  async contact(contactEmailDto: ContactEmailDto) {
    return this.repository.contact(contactEmailDto);
  }
}
