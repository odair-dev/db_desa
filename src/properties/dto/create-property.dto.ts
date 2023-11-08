import { $Enums, Category_Property } from '@prisma/client';
import { Type } from 'class-transformer';
import {
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
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsString()
  @IsOptional()
  available: boolean;

  @IsEnum(Category_Property)
  @IsOptional()
  category: $Enums.Category_Property;
}

export class CreatePropertyAndAddressDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsString()
  @IsOptional()
  available: boolean;

  @IsEnum(Category_Property)
  @IsOptional()
  category: $Enums.Category_Property;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
