import { RequestHandler } from 'express';
import { nanoid } from 'nanoid';
import createError from 'http-errors';
import User from '../models/User.model';
import HomeFeed from '../models/HomeFeed.model';
import {
  loginSchema,
  signUpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../utils/schema_validation';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import {
  setResetPasswordToken,
  verifyResetPasswordToken,
  deleteResetPasswordToken,
} from '../utils/reset_password';
import { sendEmail } from '../utils/sendEmail';
import RedisClient from '../config/redis';

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const {
      error,
      value: { username, password },
    } = loginSchema.validate(req.body);

    if (error) throw new createError.BadRequest(error.message);

    const { id, username: currUsername } = await User.login(username, password);
    const accessToken = await signAccessToken(id, currUsername);
    const refreshToken = await signRefreshToken(id, currUsername);
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      httpOnly: true,
      // path: '/auth/refresh-token', // cookie will only be sent when directed to this route
    });
    res.status(200).json({ accessToken, uid: id, username });
  } catch (error) {
    next(error);
  }
};

export const signUpUser: RequestHandler = async (req, res, next) => {
  try {
    // validate req body
    const {
      error,
      value: { username, email, name, password },
    } = signUpSchema.validate(req.body);
    if (error) throw new createError.BadRequest(error.message);

    // check if username is already in use
    const usernameInUse = await User.findOne({ username });
    if (usernameInUse)
      throw new createError.Conflict('Username is already in use.');
    // check if email is already in use
    const emailInUse = await User.findOne({ email });
    if (emailInUse) throw new createError.Conflict('Email is already in use.');

    // create user and save in db
    const { id, username: currUsername } = await User.create({
      username,
      email,
      name,
      password,
    });

    // create users home feed
    await HomeFeed.create({
      user: id,
    });

    // create accessToken and refreshToken
    const accessToken = await signAccessToken(id, currUsername);
    const refreshToken = await signRefreshToken(id, currUsername);
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      httpOnly: true,
      // path: '/auth/refresh-token', // this cookie can only be used in this route
    });
    res.status(200).json({ accessToken, uid: id, username: currUsername });
  } catch (error) {
    next(error);
  }
};

export const getRefreshToken: RequestHandler = async (req, res, next) => {
  try {
    // verify the current refresh token is valid
    console.log(req.cookies);
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken)
      throw new createError.BadRequest('Please provide a refreshToken');
    const { uid, username } = (await verifyRefreshToken(refreshToken)) as {
      uid: string;
      username: string;
    };
    const accessToken = await signAccessToken(uid, username);
    const newRefreshToken = await signRefreshToken(uid, username);
    res.cookie('refreshToken', newRefreshToken, {
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      httpOnly: true,
      // path: '/auth/refresh-token',
    });
    // if so, generate a new access token and refresh token
    res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const forgotPassword: RequestHandler = async (req, res, next) => {
  // TODO user submitted email, validate email, send link with forgot password and store resetpassword token in redis
  try {
    const {
      error,
      value: { email },
    } = forgotPasswordSchema.validate(req.body);
    if (error) throw new createError.BadRequest(error.message);

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) throw new createError.NotFound('This user does not exist.');

    // create requestbody and token then store it in redis ds
    const resetPasswordToken = nanoid();
    const userId = user.id;
    console.log(resetPasswordToken, userId, 'TEST***');
    await setResetPasswordToken(userId, resetPasswordToken);
    // send reset password email
    const resetPasswordLink = `${process.env
      .CLIENT_BASE_URL!}/reset_password/${resetPasswordToken}`;
    const subject = 'Liftona password reset instructions';
    const message = `Please click the following link to reset your password: <a href=${resetPasswordLink}>reset password</a><br/>Please note, this link will expire in 10 minutes.`;
    await sendEmail(email, subject, message); // TODO -> enable aws ses production so we can send emails to any email address. currently can only send to verified email
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const {
      error,
      value: { password, token },
    } = resetPasswordSchema.validate(req.body);
    if (error) throw new createError.BadRequest(error.message);

    const userId = await verifyResetPasswordToken(token);

    const user = await User.findById(userId);
    user!.password = password;
    await user!.save();

    // delete reset password request from redis
    await deleteResetPasswordToken(token);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const logOutUser: RequestHandler = async (req, res, next) => {
  // delete refresh token from redis and delete cookie
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      throw new createError.BadRequest('Please provide a refreshToken');

    // clear refreshToken cookie
    res.clearCookie('refreshToken');
    //@ts-ignore
    const { userId } = await verifyRefreshToken(refreshToken);
    // delete refreshToken key from redis
    // @ts-ignore
    RedisClient.DEL(`refresh.token:user:${userId}`, (err, value) => {
      if (err)
        throw new createError.InternalServerError('Internal Server Error');
      res.sendStatus(204);
    });
  } catch (error) {
    next(error);
  }
};
