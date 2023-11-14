import { Schedule } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ScheduleEntity implements Schedule {
  id: string;
  date: Date;
  hour: string;
  observation: string;

  @Exclude()
  user_id: string;

  @Exclude()
  property_id: string;
}
