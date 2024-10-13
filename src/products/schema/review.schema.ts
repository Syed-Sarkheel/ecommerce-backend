import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Review {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ minlength: 1, maxlength: 30 })
  reviewText: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
