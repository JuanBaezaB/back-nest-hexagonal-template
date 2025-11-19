import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
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

    const reply = context.getResponse<FastifyReply>();
    const request = context.getRequest<FastifyRequest>();
    const headers = request.headers as unknown as Headers;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(exception.message, exception, headers);

    if (this.environmentService.isDev()) {
      reply.status(status).send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message:
          exception instanceof HttpException ? exception : exception.stack,
      });
    } else {
      reply.status(status).send();
    }
  }
}
