import {AppError} from './AppError';
import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
    this.name = 'InternalServerError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY);
    this.name = 'ValidationError';
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
    this.name = 'BadRequestError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
    this.name = 'ForbiddenError';
  }
}

export class AlreadyApprovedError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.CONFLICT);
    this.name = 'AlreadyApprovedError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}
