import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnprocessableEntityException,
} from '@nestjs/common';

@Catch(UnprocessableEntityException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const exceptionResponse = exception.getResponse() as any;

    const formattedResponse = {
      message: Object.values(exceptionResponse.message[0].constraints)[0],
      error: 'Unprocessable Entity',
      statusCode: 422,
    };

    response.status(422).json(formattedResponse);
  }
}



// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { Response } from 'express';

// @Catch(HttpException)
// export class ValidationExceptionFilter implements ExceptionFilter {

//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();

//     let status = exception.getStatus() || HttpStatus.BAD_REQUEST;

//     // Change the status code to 422
//     if (status === HttpStatus.BAD_REQUEST) {
//       response.status(HttpStatus.UNPROCESSABLE_ENTITY);
//       status = HttpStatus.UNPROCESSABLE_ENTITY;
//     } else {
//       response.status(status);
//     }

//     response.json({
//       statusCode: status,
//       message: exception['response'].message || exception.message,
//       error: exception.name,
//     });
//   }
// }
