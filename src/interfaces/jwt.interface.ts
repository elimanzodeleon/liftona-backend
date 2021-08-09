import { JwtPayload } from 'jsonwebtoken';
import { IUser } from './users.interface';

export interface IUserJwtPayload extends JwtPayload {
  username: IUser['username'];
}
