import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class BadExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse: any = exception.getResponse();
    const errorsMessages = [];
    if (Array.isArray(errorResponse.message)) {
      errorResponse.message.forEach((m) => {
        errorsMessages.push(m);
      });
    } else
      errorsMessages.push({
        field: 'multipart',
        message: errorResponse.message,
      });
    response.status(status).json({ errorsMessages });
  }
}
