import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateScheduleDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/)
  @IsNotEmpty()
  hour: string;

  @IsString()
  @IsOptional()
  observation: string;

  @IsString()
  @IsOptional()
  user_id: string;

  @IsString()
  @IsOptional()
  property_id: string;
}

export class FindScheduleDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsNotEmpty()
  schedule: string;
}

export class ContactEmailDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  text: string;
}
