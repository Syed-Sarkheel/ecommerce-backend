import { Request } from 'express';
import { ObjectId } from 'mongodb';

export interface IAuthUser {
  _id: string; // Unique identifier for the user
  name: string; // Name of the user
  role: string; // Role of the user (e.g., 'admin', 'user')
}
export interface IAuthRequest extends Request {
  user: IAuthUser;
}
