import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContactEmailDto, CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { ScheduleEntity } from '../entities/schedule.entity';
import { plainToInstance } from 'class-transformer';
import { TRANSCODE_QUEUE } from 'src/constants';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import * as Mailgen from 'mailgen';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from '../dto/send-mail.dto';

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'de Sá Incorporações',
    link: 'http://localhost:3001/',
  },
});

@Injectable()
export class SchedulesRepository {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(TRANSCODE_QUEUE) private readonly transcodeQueue: Queue,
    private readonly mailerService: MailerService,
  ) {}

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
                email: true,
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
        const dataFormated = newRegisterSchedule.date;
        dataFormated.setDate(dataFormated.getDate() + 1);

        await this.transcodeQueue.add({
          ...newRegisterSchedule,
          new: true,
          contact: false,
        });

        return plainToInstance(ScheduleEntity, newRegisterSchedule);
      }
    } else {
      throw new NotFoundException('Property not found');
    }
  }

  async findAll(user_id: string, type: string) {
    if (type == 'admin') {
      const allSchedules = await this.prisma.schedule.findMany({
        include: {
          property: true,
          user: {
            select: {
              name: true,
              phone: true,
              email: true,
            },
          },
        },
      });
      const returnSchedule = [];
      allSchedules.map((schedule) => {
        const dataFormated = schedule.date;
        dataFormated.setDate(dataFormated.getDate() + 1);
        if (
          Date.parse(schedule.date.toString().slice(0, 15)) >=
          Date.parse(new Date().toString().slice(0, 15))
        ) {
          // console.log('Data do banco maior ou igual a data atual');
          returnSchedule.push(schedule);
        }
      });

      function compare(a, b) {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        if (a.hour < b.hour) {
          return -1;
        }
        if (a.hour > b.hour) {
          return 1;
        }
        return 0;
      }

      return returnSchedule.sort(compare);
    } else {
      const allSchedules = await this.prisma.schedule.findMany({
        where: {
          user_id,
        },
        include: {
          property: true,
          user: {
            select: {
              name: true,
              phone: true,
              email: true,
            },
          },
        },
      });
      const returnSchedule = [];
      allSchedules.map((schedule) => {
        const dataFormated = schedule.date;
        dataFormated.setDate(dataFormated.getDate() + 1);
        if (
          Date.parse(schedule.date.toString().slice(0, 15)) >=
          Date.parse(new Date().toString().slice(0, 15))
        ) {
          returnSchedule.push(schedule);
        }
      });

      function compare(a, b) {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        if (a.hour < b.hour) {
          return -1;
        }
        if (a.hour > b.hour) {
          return 1;
        }
        return 0;
      }

      return returnSchedule.sort(compare);
    }
  }

  async findFreeSchedule(hour: string, date: Date, id: string) {
    const findSchedule = await this.prisma.schedule.findFirst({
      where: {
        hour,
        date,
        property_id: id,
      },
    });
    if (findSchedule) {
      return { free_time_schedule: false };
    } else {
      return { free_time_schedule: true };
    }
  }

  async findOne(id: string, user_id: string, type: string) {
    const foundSchedule = await this.prisma.schedule.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
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
      include: {
        user: {
          select: {
            email: true,
            name: true,
            phone: true,
          },
        },
      },
    });
    if (foundSchedule) {
      if (type == 'admin' || foundSchedule.user_id == user_id) {
        await this.prisma.schedule.delete({
          where: {
            id,
          },
        });
        await this.transcodeQueue.add({
          ...foundSchedule,
          new: false,
          contact: false,
          reset: false,
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

  async contact(contactEmailDto: ContactEmailDto) {
    await this.transcodeQueue.add({
      user: { ...contactEmailDto },
      new: false,
      contact: true,
    });

    return true;
  }

  receiptScheduleTemplate(userEmail: string, userName: string, text: string) {
    const email = {
      body: {
        greeting: 'Olá',
        name: userName,
        intro: `Seu agendamento foi realizado com sucesso para ${text}.`,
        outro: 'DeSá Incorporações. Projetando sonhos, construindo o futuro.',
        signature: 'Atenciosamente',
      },
    };

    const emailBody = mailGenerator.generate(email);

    const emailTemplate = {
      to: userEmail,
      subject: 'Agendamento de visita',
      text: emailBody,
    };

    return emailTemplate;
  }

  async sendMail({ to, subject, text }: SendEmailDto) {
    await this.mailerService
      .sendMail({
        to,
        subject,
        html: text,
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  receiptNewScheduleTemplate(
    userEmail: string,
    userName: string,
    text: string,
  ) {
    const email = {
      body: {
        greeting: userName,
        intro: `Um novo agendamento foi realizado para ${text}.`,
        signature: 'Atenciosamente',
      },
    };

    const emailBody = mailGenerator.generate(email);

    const emailTemplate = {
      to: userEmail,
      subject: 'Agendamento de visita',
      text: emailBody,
    };

    return emailTemplate;
  }

  receiptScheduleRemoveTemplate(
    userEmail: string,
    userName: string,
    text: string,
  ) {
    const email = {
      body: {
        greeting: userName,
        intro: `Cancelou a visita ${text}.`,
        signature: 'Atenciosamente',
      },
    };

    const emailBody = mailGenerator.generate(email);

    const emailTemplate = {
      to: userEmail,
      subject: 'Cancelamento de visita',
      text: emailBody,
    };

    return emailTemplate;
  }

  contactEmailTemplate(userEmail: string, userName: string, text: string) {
    const email = {
      body: {
        greeting: userName,
        intro: text,
        signature: userEmail,
      },
    };

    const emailBody = mailGenerator.generate(email);

    const emailTemplate = {
      to: 'odairodriguez@yahoo.com.br',
      subject: 'Contato via site',
      text: emailBody,
    };

    return emailTemplate;
  }
}
