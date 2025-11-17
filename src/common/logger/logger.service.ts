import { Injectable } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { createLogger, format, Logger } from 'winston';
import { Console } from 'winston/lib/winston/transports';
import { EnvEnum } from '../environment/enum/env.enum';
import { EnvironmentService } from '../environment/environment.service';

@Injectable()
export class LoggerService {
  private logger: Logger;

  constructor(environmentService: EnvironmentService) {
    const { combine, timestamp, ms, json } = format;

    const consoleTransport = new Console({
      format: environmentService.isProd()
        ? combine(timestamp(), json())
        : combine(
            timestamp(),
            ms(),
            nestWinstonModuleUtilities.format.nestLike(
              'v' + process.env.npm_package_version,
              {
                prettyPrint: true,
              },
            ),
          ),
    });
    const level: string = environmentService.get(EnvEnum.LOG_LEVEL);
    this.logger = createLogger({
      level: level,
      transports: [consoleTransport],
      exitOnError: false,
    });
  }

  /**
   * Write a 'log' level log.
   */
  info(message: string, headers?: Headers) {
    // add your tailored logic here
    this.logger.info(message, this.buildMessage(headers));
  }

  /**
   * Write an 'error' level log.
   */
  error(message: string, exception: Error, headers?: Headers) {
    // add your tailored logic here
    this.logger.error(message, this.buildMessage(headers, exception));
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: string) {
    // add your tailored logic here
    this.logger.warn(message);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: string) {
    // add your tailored logic here
    this.logger.debug(message);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: string) {
    // add your tailored logic here
    this.logger.verbose(message);
  }

  private buildMessage(
    headers?: Headers,
    exception?: Error,
  ): Record<string, unknown> {
    if (headers && exception) {
      return {
        token: headers['Authorization'],
        exception: exception,
        stack: exception.stack,
      };
    } else if (headers) {
      return {
        token: headers['Authorization'],
      };
    } else if (exception) {
      return {
        exception: exception,
        stack: exception.stack,
      };
    }
    return {};
  }
}
