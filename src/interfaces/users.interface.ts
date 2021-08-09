import mongoose, { Document, Model } from 'mongoose';
import { IWorkout } from './workouts.interface';

export interface ICurrentUser {
  // uid: string;
  username: string;
  accessToken: string;
}

export interface IUser extends Document {
  id: string;
  username: string;
  email: string;
  name: string;
  password: string;
  workouts: IWorkout[];
  likes: IWorkout[];
  following: IUser[];
  followers: IUser[];
}

export interface IUserModel extends Model<IUser> {
  // any static method used by the User model
  login: (username: IUser['username'], password: IUser['password']) => IUser;
}
