import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, from, lastValueFrom } from 'rxjs';
import {
  TRANSACTIONAL_KEY,
  TransactionOptions,
} from '../../application/decorators/transactional.decorator';
import { TransactionManagerPort } from '../../application/ports/out/transaction-manager.port';

@Injectable()
export class TransactionalInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TransactionManagerPort)
    private readonly transactionManager: TransactionManagerPort,
  ) {}

  intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const options = this.reflector.getAllAndOverride<
      TransactionOptions | boolean
    >(TRANSACTIONAL_KEY, [context.getHandler(), context.getClass()]);

    if (!options) {
      return next.handle();
    }

    return from(
      this.transactionManager.runInTransaction(async () => {
        return await lastValueFrom(next.handle());
      }, options),
    );
  }
}
