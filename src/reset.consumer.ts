import { Job } from 'bull';
import { RESET_QUEUE } from './constants';
import { Processor, Process } from '@nestjs/bull';
import { UsersService } from './users/users.service';

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

@Processor(RESET_QUEUE)
export class ResetConsumer {
  constructor(private readonly usersService: UsersService) {}
  @Process()
  async resetqueue(job: Job<ISendMail>) {
    if (job.data.reset) {
      await this.usersService.resetPassword(
        job.data.user.email,
        job.data.user.name,
        job.data.user.reset,
      );
    }
  }
}
