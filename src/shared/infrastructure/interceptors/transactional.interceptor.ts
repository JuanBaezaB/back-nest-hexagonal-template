// src/shared/infrastructure/interceptors/transactional.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, from, lastValueFrom } from 'rxjs';
import { TRANSACTIONAL_KEY, TransactionMetadata } from '../../application/decorators/transactional.decorator';
import { TransactionManagerFactory } from '../factories/transaction-manager.factory';

@Injectable()
export class TransactionalInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly txFactory: TransactionManagerFactory,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 1. Extrae los metadatos del decorador
    const metadata = this.reflector.getAllAndOverride<TransactionMetadata>(
      TRANSACTIONAL_KEY,
      [context.getHandler(), context.getClass()]
    );

    // 2. Si no hay decorador, pasa directo
    if (!metadata) {
      return next.handle();
    }

    // 3. Obtiene el manager correcto por nombre lógico
    const manager = this.txFactory.getManager(metadata.connectionName);

    // 4. Ejecuta dentro de la transacción
    return from(
      manager.runInTransaction(async () => {
        return await lastValueFrom(next.handle());
      }),
    );
  }
}
