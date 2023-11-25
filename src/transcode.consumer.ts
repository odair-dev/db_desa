import { Job } from 'bull';
import { TRANSCODE_QUEUE } from './constants';
import { Processor, Process } from '@nestjs/bull';
// import { UsersService } from './users/users.service';
import { SchedulesService } from './schedules/schedules.service';

interface ISendMail {
  date: Date;
  hour: string;
  new: boolean;
  contact: boolean;
  reset: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    reset: string;
    active: boolean;
    text: string;
  };
}

@Processor(TRANSCODE_QUEUE)
export class TranscodeConsumer {
  constructor(
    // private readonly usersService: UsersService,
    private readonly schedulesService: SchedulesService,
  ) {}

  @Process()
  async transcode(job: Job<ISendMail>) {
    if (job.data.new) {
      await this.schedulesService.sendEmailSchedule(
        job.data.user.email,
        job.data.user.name,
        `o dia ${new Date(job.data.date).toLocaleDateString()}
        às ${job.data.hour}`,
      );
      await this.schedulesService.sendEmailNewSchedule(
        'odairodriguez@yahoo.com.br',
        job.data.user.name,
        `o dia ${new Date(job.data.date).toLocaleDateString()}
        às ${job.data.hour}. Telefone: ${job.data.user.phone} - E-mail: ${
          job.data.user.email
        }`,
      );
    }
    if (
      job.data.new == false &&
      job.data.contact == false &&
      job.data.reset == false
    ) {
      await this.schedulesService.sendEmailRemoveSchedule(
        'odairodriguez@yahoo.com.br',
        job.data.user.name,
        `do dia ${new Date(job.data.date).toLocaleDateString()}
        às ${job.data.hour}. Telefone: ${job.data.user.phone} - E-mail: ${
          job.data.user.email
        }`,
      );
    }
    if (job.data.contact) {
      await this.schedulesService.contactEmail(
        job.data.user.email,
        job.data.user.name,
        job.data.user.text,
      );
    }
    // if (job.data.reset) {
    //   await this.usersService.resetPassword(
    //     job.data.user.email,
    //     job.data.user.name,
    //     job.data.user.reset,
    //   );
    // }
  }
}
