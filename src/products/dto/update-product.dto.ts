import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(12)
  description?: string;

  @IsNumber()
  price?: number;

  @IsNumber()
  stock?: number;

  @IsString()
  category?: string;
}
