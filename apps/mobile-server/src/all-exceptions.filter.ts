import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  @SentryExceptionCaptured()
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.status || 500;
    const message = exception.message || 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
