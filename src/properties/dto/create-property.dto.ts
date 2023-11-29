import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { $Enums, Category_Property } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from 'src/adresses/dto/create-address.dto';

export class CreatePropertyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  available: boolean;

  @ApiPropertyOptional()
  @IsEnum(Category_Property)
  @IsOptional()
  category: $Enums.Category_Property;
}

export class CreatePropertyAndAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  available: boolean;

  @ApiPropertyOptional()
  @IsEnum(Category_Property)
  @IsOptional()
  category: $Enums.Category_Property;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
