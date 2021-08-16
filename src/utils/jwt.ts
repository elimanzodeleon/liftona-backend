import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import RedisClient from '../config/redis';
import { IUserDataRequest } from '../interfaces/requestHandler.interface';
import { ICurrentUser } from '../interfaces/users.interface';
import { IUserJwtPayload } from '../interfaces/jwt.interface';
import { REFRESH_TOKEN_EXPIRE } from '../utils/constants';

export const signAccessToken = (
  uid: string,
  username: ICurrentUser['username']
) => {
  console.log(uid);
  return new Promise((resolve, reject) => {
    const payload = { username };
    const secret = process.env.ACCESS_TOKEN_SECRET!;
    const options = {
      expiresIn: '10m',
      issuer: 'liftona.io',
      subject: uid,
    };
    try {
      const token = jwt.sign(payload, secret, options);
      resolve(token);
    } catch (error) {
      console.log(error.message);
      reject(new createError.InternalServerError('Internal Server Error.'));
    }
  });
};

export const signRefreshToken = (
  uid: string,
  username: ICurrentUser['username']
) => {
  // TODO - move from redis to mongodb
  return new Promise((resolve, reject) => {
    const payload = { username };
    const secret = process.env.REFRESH_TOKEN_SECRET!;
    const options = {
      expiresIn: '1y',
      issuer: 'liftona.io',
      subject: uid,
    };
    try {
      const token = jwt.sign(payload, secret, options);
      RedisClient.SETEX(
        `refresh.token:user:${uid}`,
        REFRESH_TOKEN_EXPIRE,
        token,
        (err, reply) => {
          if (err)
            return reject(
              new createError.InternalServerError('Internal Server Error.')
            );
          resolve(token);
        }
      );
    } catch (error) {
      console.log(error.message);
      reject(new createError.InternalServerError('Internal Server Error.'));
    }
  });
};

// this will be used as middleware for any endpoint that requires a user to be logged in.
// so pretty much every endpoint apart from those in '/auth'
export const verifyAccessToken = (
  req: IUserDataRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new createError.Unauthorized();

    const secret = process.env.ACCESS_TOKEN_SECRET!;
    const data = jwt.verify(token, secret) as IUserJwtPayload;
    req.data = { uid: data.sub!, username: data.username };
    next();
  } catch (error) {
    const message =
      error.name === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
    next(new createError.Unauthorized(message));
  }
};

export const verifyRefreshToken = (refreshToken: string) => {
  // TODO - move from redis to mongodb
  return new Promise((resolve, reject) => {
    try {
      const { sub: uid, username } = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as IUserJwtPayload;
      RedisClient.GET(`refresh.token:user:${uid}`, (err, value) => {
        if (err) {
          return reject(
            new createError.InternalServerError('Internal Server Error.')
          );
        }
        // token in redis matched token provided by client: OK
        if (refreshToken === value) {
          return resolve({ uid, username });
        }

        // token most likely expired so user will have to login
        reject(new createError.Unauthorized());
      });
    } catch (error) {
      // unable to verify refresh token so invoke unauthorized error
      reject(new createError.Unauthorized());
    }
  });
};
