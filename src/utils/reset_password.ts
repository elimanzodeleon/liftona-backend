import createError from 'http-errors';
import ResetPasswordToken from '../models/ResetPasswordToken.model';
import RedisClient from '../config/redis';

import { RESET_PASSWORD_TOKEN_EXPIRE } from './constants';

export const setResetPasswordToken = (uid: string, token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('attempting token creations');
      const reply = await ResetPasswordToken.create({
        user: uid,
        token,
      });
      resolve(reply);
    } catch (error) {
      reject(new createError.InternalServerError('Internal Server Error'));
    }
  });
};

export const verifyResetPasswordToken = (tokenArg: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tokenDetails = await ResetPasswordToken.findOne({
        token: tokenArg,
      });
      if (!tokenDetails)
        return reject(
          new createError.Unauthorized(
            'This link has expired. Please submit a new reset password request if you would like to reset your password.'
          )
        );
      const { user, token } = tokenDetails;
      if (token === tokenArg) return resolve(user);

      // there is a token but the tokens don't match so user tryna pull a fast one
      reject(new createError.Unauthorized());
    } catch (error) {
      reject(new createError.InternalServerError('Internal Server Error'));
    }
  });
};

export const deleteResetPasswordToken = (token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const reply = await ResetPasswordToken.findOneAndDelete({ token });
      resolve(reply);
    } catch (error) {
      reject(new createError.InternalServerError('Internal Server Error'));
    }
  });
};
