import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { EnvironmentService } from '../environment/environment.service';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly environmentService: EnvironmentService,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(exception.message, exception, request.headers);

    if (this.environmentService.isDev()) {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message:
          exception instanceof HttpException ? exception : exception.stack,
      });
    } else {
      response.status(status).json();
    }
  }
}
