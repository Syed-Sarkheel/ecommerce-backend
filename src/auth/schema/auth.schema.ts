import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRoles } from '../enums/user.roles';
import { Timestamp } from 'mongodb';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: UserRoles.CUSTOMER, enum: UserRoles })
  role: UserRoles;

  @Prop({ default: null })
  phone: number;

  @Prop({ required: true, default: () => new Date() })
  createdOn: Timestamp;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
