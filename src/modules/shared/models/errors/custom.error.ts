import { HttpCodeConstants } from '../constants/http-code.constants';

export class CustomError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }

  static badRequest(message: string): CustomError {
    return new CustomError(message, HttpCodeConstants.BAD_REQUEST);
  }

  static unauthorized(message: string): CustomError {
    return new CustomError(message, HttpCodeConstants.UNAUTHORIZED);
  }

  static forbidden(message: string): CustomError {
    return new CustomError(message, HttpCodeConstants.FORBIDDEN);
  }

  static notFound(message: string): CustomError {
    return new CustomError(message, HttpCodeConstants.NOT_FOUND);
  }

  static conflict(message: string): CustomError {
    return new CustomError(message, HttpCodeConstants.CONFLICT);
  }

  static internal(message: string = 'Internal Server Error'): CustomError {
    return new CustomError(message, HttpCodeConstants.INTERNAL);
  }

  static serviceUnavailable(message: string): CustomError {
    return new CustomError(message, HttpCodeConstants.SERVICE_UNAVAILABLE);
  }

  static customError(message: string, statusCode: number): CustomError {
    return new CustomError(message, statusCode);
  }
}
