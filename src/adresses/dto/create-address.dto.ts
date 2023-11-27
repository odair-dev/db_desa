import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cep: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  number: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  complement: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  property_id: string;
}
