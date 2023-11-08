import { $Enums, Category_Property } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
