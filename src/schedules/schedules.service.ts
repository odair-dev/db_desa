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

  findFreeSchedule(schedules: string, date: Date, id: string) {
    return this.repository.findFreeSchedule(schedules, date, id);
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

  // sendEmailResetAccount(email: string) {
  //   return this.repository.sendEmailResetPassword(email);
  // }

  async sendEmailSchedule(email: string, name: string, text: string) {
    const receiptScheduleTemplate = this.repository.receiptScheduleTemplate(
      email,
      name,
      text,
    );

    await this.repository.sendMail(receiptScheduleTemplate);
  }

  async sendEmailNewSchedule(email: string, name: string, text: string) {
    const receiptScheduleTemplate = this.repository.receiptNewScheduleTemplate(
      email,
      name,
      text,
    );

    await this.repository.sendMail(receiptScheduleTemplate);
  }

  async sendEmailRemoveSchedule(email: string, name: string, text: string) {
    const receiptScheduleTemplate =
      this.repository.receiptScheduleRemoveTemplate(email, name, text);

    await this.repository.sendMail(receiptScheduleTemplate);
  }

  async contactEmail(email: string, name: string, text: string) {
    const contactEmailTemplate = this.repository.contactEmailTemplate(
      email,
      name,
      text,
    );

    await this.repository.sendMail(contactEmailTemplate);
  }
}
