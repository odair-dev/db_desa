import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/)
  @IsNotEmpty()
  hour: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  observation: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  user_id: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  property_id: string;
}

export class FindScheduleDto {
  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  schedule: string;
}

export class ContactEmailDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  text: string;
}
