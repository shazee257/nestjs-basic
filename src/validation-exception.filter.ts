import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = exception.getStatus() || HttpStatus.BAD_REQUEST;

    if (status === HttpStatus.BAD_REQUEST) {
      // Change the status code to 422
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
