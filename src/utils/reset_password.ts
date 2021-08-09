import createError from 'http-errors';
import RedisClient from '../config/redis';
import { RESET_PASSWORD_TOKEN_EXPIRE } from './constants';

export const setResetPasswordToken = (request: string, token: string) => {
  return new Promise((resolve, reject) => {
    RedisClient.SETEX(
      `reset.password.request:${token}`,
      RESET_PASSWORD_TOKEN_EXPIRE,
      request,
      (err, reply) => {
        if (err)
          reject(new createError.InternalServerError('Internal Server Error'));
        resolve(reply);
      }
    );
  });
};

export const verifyResetPasswordToken = (token: string) => {
  return new Promise((resolve, reject) => {
    RedisClient.GET(`reset.password.request:${token}`, (err, value) => {
      if (err)
        reject(new createError.InternalServerError('Internal Server Error'));
      if (!value)
        return reject(
          new createError.Unauthorized(
            'This link has expired. Please submit a new reset password request if you would like to reset your password.'
          )
        );
      const { userId, resetPasswordToken } = JSON.parse(value!);
      if (resetPasswordToken === token) resolve(userId);

      reject(new createError.Unauthorized());
    });
  });
};

export const deleteResetPasswordToken = (token: string) => {
  return new Promise((resolve, reject) => {
    RedisClient.DEL(`reset.password.request:${token}`, (err, reply) => {
      if (err)
        reject(new createError.InternalServerError('Internal Server Error'));
      resolve(reply);
    });
  });
};
