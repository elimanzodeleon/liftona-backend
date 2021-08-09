import { Request } from 'express';
import { IUser } from './users.interface';

export interface IUserDataRequest extends Request {
  data?: {
    uid: string;
    username: IUser['username'];
  };
}
