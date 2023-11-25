import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository, // private readonly scheduleService: SchedulesService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.repository.create(createUserDto);
  }

  findAll(type: string) {
    return this.repository.findAll(type);
  }

  findOne(id: string, token_id: string, type: string) {
    return this.repository.findOne(id, token_id, type);
  }

  findByToken(token_reset: string) {
    return this.repository.findByTokenReset(token_reset);
  }

  updateByToken(token_reset: string, updateUserDto: UpdateUserDto) {
    return this.repository.updateByTokenReset(token_reset, updateUserDto);
  }

  update(
    id: string,
    token_id: string,
    type: string,
    updateUserDto: UpdateUserDto,
  ) {
    return this.repository.update(id, token_id, type, updateUserDto);
  }

  remove(id: string, token_id: string, type: string) {
    return this.repository.remove(id, token_id, type);
  }

  // async sendEmailSchedule(email: string, name: string, text: string) {
  //   const receiptScheduleTemplate = this.repository.receiptScheduleTemplate(
  //     email,
  //     name,
  //     text,
  //   );

  //   await this.repository.sendMail(receiptScheduleTemplate);
  // }

  // async sendEmailNewSchedule(email: string, name: string, text: string) {
  //   const receiptScheduleTemplate = this.repository.receiptNewScheduleTemplate(
  //     email,
  //     name,
  //     text,
  //   );

  //   await this.repository.sendMail(receiptScheduleTemplate);
  // }

  // async sendEmailRemoveSchedule(email: string, name: string, text: string) {
  //   const receiptScheduleTemplate =
  //     this.repository.receiptScheduleRemoveTemplate(email, name, text);

  //   await this.repository.sendMail(receiptScheduleTemplate);
  // }

  // async contactEmail(email: string, name: string, text: string) {
  //   const contactEmailTemplate = this.repository.contactEmailTemplate(
  //     email,
  //     name,
  //     text,
  //   );

  //   await this.repository.sendMail(contactEmailTemplate);
  // }

  async resetPassword(email: string, name: string, token: string) {
    const resetPasswordTemplate = this.repository.resetPasswordTemplate(
      email,
      name,
      token,
    );

    await this.repository.sendMail(resetPasswordTemplate);
  }

  requestResetPassword(email: string) {
    return this.repository.resetPassword(email);
  }
}
