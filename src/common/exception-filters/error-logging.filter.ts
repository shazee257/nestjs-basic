// error-logging.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { LoggingService } from '../../modules/logging/logging.service';

@Catch()
export class ErrorLoggingFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) { }

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception instanceof HttpException ? exception.getStatus() : 500;

    // Log the error using the LoggingService
    await this.loggingService.logErrorToDatabase(exception, statusCode);

    response.status(statusCode).json({
      statusCode,
      message: exception?.message?.replace(/\"/g, ''),
      error: exception?.name,
    });
  }
}
