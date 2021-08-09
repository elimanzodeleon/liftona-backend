import { RequestHandler, Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { IError } from '../interfaces';

export const nothingFoundHandler: RequestHandler = (req, res, next) => {
  next(new createError.NotFound());
};

export const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .status(err.status || 500)
    .json({ error: { status: err.status || 500, message: err.message } });
};
