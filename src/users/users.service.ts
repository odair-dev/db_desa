import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';
// import { TRANSCODE_QUEUE } from 'src/constants';
// import { Queue } from 'bull';
// import { InjectQueue } from '@nestjs/bull';
// import { ContactEmailDto } from './dto/send-mail.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository, // @InjectQueue(TRANSCODE_QUEUE) private readonly transcodeQueue: Queue,
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

  // async contact(contactEmailDto: ContactEmailDto) {
  //   await this.transcodeQueue.add({
  //     user: { ...contactEmailDto },
  //     new: false,
  //     contact: true,
  //   });

  //   return true;
  // }
}
