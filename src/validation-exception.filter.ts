import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = exception.getStatus() || HttpStatus.BAD_REQUEST;

    // Change the status code to 422
    if (status === HttpStatus.BAD_REQUEST) {
      response.status(HttpStatus.UNPROCESSABLE_ENTITY);
      status = HttpStatus.UNPROCESSABLE_ENTITY;
    } else {
      response.status(status);
    }

    response.json({
      statusCode: status,
      message: exception['response'].message || exception.message,
      error: exception.name,
    });
  }
}
