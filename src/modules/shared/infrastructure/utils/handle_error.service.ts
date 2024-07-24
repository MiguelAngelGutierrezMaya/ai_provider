import { HttpException, Injectable } from '@nestjs/common';
import { CustomError } from '../../models/errors/custom.error';
import { HttpCodeConstants } from '../../models/constants/http-code.constants';
import { CustomResponseInterface } from '../../models/interfaces/custom-response.interface';

@Injectable()
export class HandleErrorService {
  constructor() {}

  handle(error: unknown): HttpException {
    const customResponse = {
      message: 'Internal server error',
      status: false,
      payload: {},
    } as CustomResponseInterface;

    if (error instanceof CustomError) {
      customResponse.message = error.message;
      throw new HttpException(customResponse, error.statusCode);
    } else {
      throw new HttpException(customResponse, HttpCodeConstants.INTERNAL);
    }
  }
}
