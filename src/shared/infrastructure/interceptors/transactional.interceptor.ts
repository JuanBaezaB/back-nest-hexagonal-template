import { EntityManager } from '@mikro-orm/postgresql';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, from, lastValueFrom } from 'rxjs';
import { TRANSACTIONAL_KEY } from '../../application/decorators/transactional.decorator';

@Injectable()
export class TransactionalInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly em: EntityManager,
  ) {}

  intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const isTransactional = this.reflector.getAllAndOverride<boolean>(
      TRANSACTIONAL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isTransactional) {
      return next.handle();
    }

    return from(
      this.em.transactional(async () => {
        return await lastValueFrom(next.handle());
      }),
    );
  }
}
