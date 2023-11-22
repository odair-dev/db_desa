import { Job } from 'bull';
import { TRANSCODE_QUEUE } from './constants';
import { Processor, Process } from '@nestjs/bull';
import { UsersService } from './users/users.service';

interface ISendMail {
  date: Date;
  hour: string;
  new: boolean;
  contact: boolean;
  user: {
    name: string;
    email: string;
    phone: string;
    text: string;
  };
}

@Processor(TRANSCODE_QUEUE)
export class TranscodeConsumer {
  constructor(private readonly usersService: UsersService) {}

  @Process()
  async transcode(job: Job<ISendMail>) {
    if (job.data.new) {
      await this.usersService.sendEmailSchedule(
        job.data.user.email,
        job.data.user.name,
        `o dia ${new Date(job.data.date).toLocaleDateString()}
        às ${job.data.hour}`,
      );
      await this.usersService.sendEmailNewSchedule(
        'odairodriguez@yahoo.com.br',
        job.data.user.name,
        `o dia ${new Date(job.data.date).toLocaleDateString()}
        às ${job.data.hour}. Telefone: ${job.data.user.phone} - E-mail: ${
          job.data.user.email
        }`,
      );
    }
    if (job.data.new == false && job.data.contact == false) {
      await this.usersService.sendEmailRemoveSchedule(
        'odairodriguez@yahoo.com.br',
        job.data.user.name,
        `do dia ${new Date(job.data.date).toLocaleDateString()}
        às ${job.data.hour}. Telefone: ${job.data.user.phone} - E-mail: ${
          job.data.user.email
        }`,
      );
    }
    if (job.data.contact) {
      await this.usersService.contactEmail(
        job.data.user.email,
        job.data.user.name,
        job.data.user.text,
      );
    }
  }
}
