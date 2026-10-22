import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';

/**
 * Converts transient MongoDB connectivity failures into a friendly 503 so the
 * frontends can show a retry message rather than an opaque 500.
 */
@Catch()
export class MongoExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception?.getStatus?.() || exception?.status;

    const isMongoNetworkError =
      exception?.name === 'MongoNetworkError' ||
      exception?.name === 'MongoServerSelectionError' ||
      exception?.name === 'MongooseServerSelectionError' ||
      ['ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND'].includes(exception?.code) ||
      /buffering timed out|connection .* closed|topology is closed/i.test(
        exception?.message || '',
      );

    if (exception?.name === 'ValidationError') {
      const messages = Object.values(exception.errors || {}).map((err: any) => err.message);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: messages[0] || 'The submitted data is invalid.',
        error: 'Bad Request',
      });
    }

    if (exception?.code === 11000) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'A record with these details already exists.',
        error: 'Conflict',
      });
    }

    if (isMongoNetworkError) {
      this.logger.error(`Database temporarily unavailable: ${exception?.message}`);
      return response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message:
          'The store database is temporarily unavailable. Please try again in a moment.',
        error: 'Service Unavailable',
      });
    }

    if (status) {
      return response.status(status).json(
        typeof exception.getResponse === 'function'
          ? exception.getResponse()
          : { statusCode: status, message: exception.message },
      );
    }

    this.logger.error(exception?.stack || exception?.message || 'Unknown error');
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong. Please try again.',
      error: 'Internal Server Error',
    });
  }
}
