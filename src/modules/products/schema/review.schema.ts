import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/modules/auth/schema/auth.schema';

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ minlength: 1, maxlength: 150 })
  reviewText: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: false })
  userName: string;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
