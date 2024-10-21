import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { INTERNAL_SERVER_ERROR, INVALID_TOKEN } from '../utils/constants';
import { errorResMsg } from '../utils/response';
import logger from '../utils/logger';

interface CustomError extends Error {
  statusCode?: number;
  inner?: { name: string };
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): any => {
  logger.error(err.message, err.stack)

  if (typeof err === 'string') {
    // custom application error
    return errorResMsg(res, StatusCodes.BAD_REQUEST, err);
  }

  if (err.inner && err.inner.name === 'JsonWebTokenError') {
    // jwt authentication error
    return errorResMsg(res, StatusCodes.UNAUTHORIZED, INVALID_TOKEN);
  }

  if (err.name === 'UnauthorizedError') {
    // jwt params error
    return errorResMsg(res, StatusCodes.UNAUTHORIZED, err.message);
  }

  // default to INTERNAL_SERVER_ERROR server error
  return errorResMsg(res, err?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, err.message || INTERNAL_SERVER_ERROR);
};