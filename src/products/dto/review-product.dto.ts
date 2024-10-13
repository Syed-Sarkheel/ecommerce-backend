import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ReviewProductDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsOptional()
  @IsString()
  reviewText: string;

  @IsNumber()
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  rating: number;
}
