import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ReviewProductDto {
  @IsOptional()
  @IsString()
  reviewText: string;

  @IsNumber()
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  rating: number;
}
