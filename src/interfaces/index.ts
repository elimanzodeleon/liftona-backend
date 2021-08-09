import { RequestHandler } from 'express';

export interface IError extends Error {
  status?: number;
}
