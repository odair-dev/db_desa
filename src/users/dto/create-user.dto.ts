import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { $Enums, Type_user } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => hashSync(value, 10), {
    groups: ['transform'],
  })
  password: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  active: boolean;

  @ApiPropertyOptional()
  @IsEnum(Type_user)
  @IsOptional()
  type: $Enums.Type_user;
}
